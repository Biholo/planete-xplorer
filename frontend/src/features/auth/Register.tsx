"use client"


import { useRegister } from '@/api/queries/authQueries'
import { Button } from "@/components/ui/Button/Button"
import { Card } from "@/components/ui/Card/Card"
import { DatePicker } from '@/components/ui/DatePicker/DatePicker'
import { Input } from "@/components/ui/Input/Input"
import { SelectInput } from '@/components/ui/SelectInput/SelectInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterDto, Register as RegisterSchema } from '@shared/dto'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Check, Eye, EyeOff, Lock, Mail, Phone, Rocket, User } from "lucide-react"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>({
    resolver: zodResolver(RegisterSchema),
  });

  const { mutate: registerUser, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterDto) => {
    console.log(data);
    try {
      const formattedData = {
        ...data,
        birthDate: data.birthDate.toString(),
      };
      registerUser(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const getPasswordStrength = () => {
    const password = watch('password') || '';
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "Faible", color: "bg-red-500" };
    if (password.length < 8) return { strength: 2, label: "Moyen", color: "bg-yellow-500" };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: "Fort", color: "bg-green-500" };
    }
    return { strength: 2, label: "Moyen", color: "bg-yellow-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-space-black via-nebula-blue to-space-black relative overflow-hidden">
      {/* Fond étoilé animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-stellar-cyan rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-electric-blue rounded-full animate-twinkle"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-stellar-cyan rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-stellar-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-electric-blue rounded-full animate-twinkle"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
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
            🚀 Rejoignez la communauté des explorateurs galactiques
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-b from-nebula-blue/80 to-space-black/90 border border-electric-blue/30 backdrop-blur-sm relative overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(102, 252, 241, 0.15)' }}
          >
            {/* Effet de brillance sur la carte */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stellar-cyan/5 to-transparent opacity-50"></div>
            
            <div className="relative z-10 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-mono text-stellar-cyan mb-2 tracking-wide">
                  ⭐ Créer un Compte
                </h2>
                <p className="text-stellar-white/70 font-mono text-sm">
                  Commencez votre voyage dans l'univers
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-stellar-white font-mono font-semibold text-sm">
                      Nom <span className="text-mars-orange">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                      <Input
                        label="Nom"
                        {...register('lastName')}
                        className="bg-space-black/50 border-electric-blue/50 text-stellar-white placeholder:text-stellar-white/50 focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono pl-10"
                        placeholder="Dupont"
                        style={{
                          boxShadow: errors.lastName ? '0 0 10px rgba(255, 107, 53, 0.3)' : 'none'
                        }}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-mars-orange text-sm font-mono">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-stellar-white font-mono font-semibold text-sm">
                      Prénom <span className="text-mars-orange">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                      <Input
                        label="Prénom"
                        {...register('firstName')}
                        className="bg-space-black/50 border-electric-blue/50 text-stellar-white placeholder:text-stellar-white/50 focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono pl-10"
                        placeholder="Jean"
                        style={{
                          boxShadow: errors.firstName ? '0 0 10px rgba(255, 107, 53, 0.3)' : 'none'
                        }}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-mars-orange text-sm font-mono">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-stellar-white font-mono font-semibold text-sm">
                      Civilité <span className="text-mars-orange">*</span>
                    </label>
                    <SelectInput
                      label="Civilité"
                      name="civility"
                      value={watch('civility')}
                      onChange={(value) => setValue('civility', value)}
                      error={errors.civility?.message}
                      options={[
                        { value: 'M', label: 'Monsieur' },
                        { value: 'Mme', label: 'Madame' },
                        { value: 'O', label: 'Autres' },
                      ]}
                      required
                    />
                    {errors.civility && (
                      <p className="text-mars-orange text-sm font-mono">{errors.civility.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-stellar-white font-mono font-semibold text-sm">
                      Date de naissance
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50 z-10" />
                      <DatePicker
                        label="Date de naissance"
                        value={watch('birthDate') ? new Date(watch('birthDate')) : undefined}
                        onChange={(date: Date) => setValue('birthDate', date.toISOString())}
                        error={errors.birthDate?.message}
                        className="bg-space-black/50 border-electric-blue/50 text-stellar-white pl-10"
                        required
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="text-mars-orange text-sm font-mono">{errors.birthDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <label className="text-stellar-white font-mono font-semibold text-sm">
                    Adresse Email <span className="text-mars-orange">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                    <Input
                      label="Adresse Email"
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
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                    <Input
                      label="Téléphone"
                      type="tel"
                      {...register('phone')}
                      className="bg-space-black/50 border-electric-blue/50 text-stellar-white placeholder:text-stellar-white/50 focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono pl-10"
                      placeholder="06 12 34 56 78"
                      style={{
                        boxShadow: errors.phone ? '0 0 10px rgba(255, 107, 53, 0.3)' : 'none'
                      }}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-mars-orange text-sm font-mono">{errors.phone.message}</p>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-stellar-white font-mono font-semibold text-sm">
                      Mot de passe <span className="text-mars-orange">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                      <Input
                        label="Mot de passe"
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
                    {watch('password') && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-electric-blue/30 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-stellar-white/70">{passwordStrength.label}</span>
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-mars-orange text-sm font-mono">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-stellar-white font-mono font-semibold text-sm">
                      Confirmer le mot de passe <span className="text-mars-orange">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                      <Input
                        label="Confirmer le mot de passe"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register('confirmPassword')}
                        className="bg-space-black/50 border-electric-blue/50 text-stellar-white placeholder:text-stellar-white/50 focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono pl-10 pr-10"
                        placeholder="••••••••"
                        style={{
                          boxShadow: errors.confirmPassword ? '0 0 10px rgba(255, 107, 53, 0.3)' : 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stellar-white/50 hover:text-stellar-cyan transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {watch('confirmPassword') && (
                      <div className="flex items-center gap-2">
                        {watch('password') === watch('confirmPassword') ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-red-500" />
                        )}
                        <span
                          className={`text-xs ${
                            watch('password') === watch('confirmPassword') ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {watch('password') === watch('confirmPassword')
                            ? "Mots de passe identiques"
                            : "Mots de passe différents"}
                        </span>
                      </div>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-mars-orange text-sm font-mono">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Préférences */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      {...register('acceptTerms')}
                      className="w-4 h-4 text-stellar-cyan bg-space-black border-electric-blue/50 rounded focus:ring-stellar-cyan/20"
                    />
                    <label htmlFor="acceptTerms" className="text-stellar-white/80 text-sm font-mono">
                      J'accepte les conditions d'utilisation et je comprends que mes données
                      seront traitées avec le plus grand soin pour améliorer mon expérience.
                      <span className="text-mars-orange"> *</span>
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-mars-orange text-sm font-mono ml-6">{errors.acceptTerms.message}</p>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="acceptPrivacy"
                      {...register('acceptPrivacy')}
                      className="w-4 h-4 text-stellar-cyan bg-space-black border-electric-blue/50 rounded focus:ring-stellar-cyan/20"
                    />
                    <label htmlFor="acceptPrivacy" className="text-stellar-white/80 text-sm font-mono">
                      Je consens à la collecte et au traitement de mes données personnelles,
                      qui seront utilisées uniquement pour personnaliser mes services et ne
                      seront jamais vendues à des tiers.
                      <span className="text-mars-orange"> *</span>
                    </label>
                  </div>
                  {errors.acceptPrivacy && (
                    <p className="text-mars-orange text-sm font-mono ml-6">{errors.acceptPrivacy.message}</p>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="acceptNewsletter"
                      {...register('acceptNewsletter')}
                      className="w-4 h-4 text-stellar-cyan bg-space-black border-electric-blue/50 rounded focus:ring-stellar-cyan/20"
                    />
                    <label htmlFor="acceptNewsletter" className="text-stellar-white/80 text-sm font-mono">
                      Je souhaite recevoir des offres exclusives et des contenus personnalisés
                      soigneusement sélectionnés pour moi.
                    </label>
                  </div>
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
                      Inscription en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>S'INSCRIRE</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-stellar-white/70 text-sm font-mono">
                  Déjà un compte ?{" "}
                  <Link
                    to="/login"
                    className="text-stellar-cyan hover:text-stellar-white transition-colors font-semibold"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </Card>
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
