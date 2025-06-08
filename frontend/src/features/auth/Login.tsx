"use client"


import { useLogin } from '@/api/queries/authQueries'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginDto, Login as LoginSchema } from '@shared/dto'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail, Rocket, UserPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
 
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  })

  const { mutate: loginUser, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginDto) => {
    try {
      loginUser(data)
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-space-black via-nebula-blue to-space-black relative overflow-hidden">
      {/* Fond étoilé animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-stellar-cyan rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-electric-blue rounded-full animate-twinkle"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-stellar-cyan rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-stellar-white rounded-full animate-pulse"></div>
        <div className="absolute top-10 left-10 w-1 h-1 bg-stellar-cyan rounded-full animate-twinkle"></div>
        <div className="absolute bottom-20 right-16 w-0.5 h-0.5 bg-electric-blue rounded-full animate-pulse delay-300"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* En-tête avec logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="relative"
            >
              <Rocket className="h-12 w-12 text-stellar-cyan animate-float" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-stellar-cyan rounded-full animate-pulse"></div>
            </motion.div>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold font-mono text-stellar-cyan mb-2 tracking-wider"
          >
            PlanèteXplorer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-stellar-white/70 font-mono"
          >
            🌌 Explorez l'univers infini
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-b from-nebula-blue/80 to-space-black/90 border border-electric-blue/30 backdrop-blur-sm relative overflow-hidden rounded-lg p-8"
          style={{ boxShadow: '0 0 40px rgba(102, 252, 241, 0.15)' }}
        >
          {/* Effet de brillance sur la carte */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stellar-cyan/5 to-transparent opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-mono text-stellar-cyan mb-2 tracking-wide">
                ⚡ Connexion
              </h2>
              <p className="text-stellar-white/70 font-mono text-sm">
                Accédez à votre tableau de bord galactique
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-stellar-white font-mono font-semibold text-sm">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                  <Input
                    type="email"
                    {...register('email')}
                    className="bg-space-black/50 border-electric-blue/50 text-stellar-white placeholder:text-stellar-white/50 focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono pl-10"
                    placeholder="votre@email.com"
                    style={{
                      boxShadow: errors.email ? '0 0 10px rgba(255, 107, 53, 0.3)' : 'none'
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-mars-orange text-sm font-mono">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-stellar-white font-mono font-semibold text-sm">
                  Mot de Passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className="bg-space-black/50 border-electric-blue/50 text-stellar-white placeholder:text-stellar-white/50 focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono pl-10 pr-10"
                    placeholder="••••••••"
                    style={{
                      boxShadow: errors.password ? '0 0 10px rgba(255, 107, 53, 0.3)' : 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stellar-white/50 hover:text-stellar-cyan transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-mars-orange text-sm font-mono">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 text-stellar-cyan bg-space-black border-electric-blue/50 rounded focus:ring-stellar-cyan/20"
                  />
                  <label htmlFor="rememberMe" className="text-stellar-white/80 text-sm font-mono">
                    Se souvenir de moi
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-stellar-cyan hover:text-stellar-white transition-colors font-mono"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full h-12 bg-gradient-to-r from-electric-blue to-stellar-cyan text-space-black font-bold hover:from-stellar-cyan hover:to-electric-blue transition-all duration-300 font-mono tracking-wide"
                style={{ boxShadow: '0 0 20px rgba(102, 252, 241, 0.4)' }}
              >
                {isSubmitting || isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-space-black border-t-transparent rounded-full animate-spin"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>SE CONNECTER</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-stellar-white/70 text-sm font-mono">
                Pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="text-stellar-cyan hover:text-stellar-white transition-colors font-semibold"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-8"
        >
          <p className="text-stellar-white/50 text-xs font-mono">
            © 2024 PlanèteXplorer. 🚀 Explorez l'univers en toute sécurité.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
