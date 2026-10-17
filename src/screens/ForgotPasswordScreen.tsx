import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Cpu, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react-native';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const { forgotPassword, verifyTotpForReset } = useAuth();

  const [step, setStep] = useState<'identify' | 'totp' | 'success'>('identify');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [resolvedEmail, setResolvedEmail] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIdentify = async () => {
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await forgotPassword(emailOrPhone.trim());
      setResolvedEmail(res.email || emailOrPhone.trim());
      setStep('totp');
    } catch (err: any) {
      setError(err.message || 'Account not found');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTotp = async () => {
    if (totpCode.trim().length !== 6) {
      setError('Please enter your 6-digit code');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await verifyTotpForReset(resolvedEmail, totpCode.trim());
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Invalid authenticator code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Cpu size={32} color="#ffffff" />
            </View>
            <Text style={styles.title}>DevMastery</Text>
            <Text style={styles.subtitle}>Password Recovery</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {step === 'identify' && 'Reset Password'}
              {step === 'totp' && 'Security Verification'}
              {step === 'success' && 'Reset Email Sent'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {step === 'identify' && 'Enter your registered email or phone'}
              {step === 'totp' && 'Verify ownership with Google Authenticator'}
              {step === 'success' && 'Secure reset link delivered via AWS SES'}
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {step === 'identify' && (
              <View style={styles.form}>
                <Text style={styles.label}>EMAIL OR MOBILE NUMBER</Text>
                <View style={styles.inputContainer}>
                  <Mail size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="alex@example.com or +919876543210"
                    placeholderTextColor="#94a3b8"
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleIdentify}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.primaryButtonText}>Next: Verify TOTP</Text>
                      <ArrowRight size={16} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {step === 'totp' && (
              <View style={styles.form}>
                <View style={styles.infoBox}>
                  <ShieldCheck size={20} color="#0284c7" />
                  <Text style={styles.infoBoxText}>
                    Google Authenticator code for {resolvedEmail}
                  </Text>
                </View>

                <Text style={styles.label}>6-DIGIT AUTHENTICATOR CODE</Text>
                <View style={styles.inputContainer}>
                  <KeyRound size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.totpInput]}
                    placeholder="123456"
                    placeholderTextColor="#94a3b8"
                    value={totpCode}
                    onChangeText={(val) => setTotpCode(val.replace(/\D/g, ''))}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleVerifyTotp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Verify & Send Reset Email</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => setStep('identify')}>
                  <Text style={styles.backButtonText}>← Change Email / Mobile</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 'success' && (
              <View style={styles.successContainer}>
                <CheckCircle2 size={48} color="#10b981" />
                <Text style={styles.successTitle}>Check Your Inbox</Text>
                <Text style={styles.successMessage}>
                  We sent a secure password reset link to {resolvedEmail} via Amazon SES. Please follow the link to set a new password.
                </Text>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.primaryButtonText}>Return to Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.cancelLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.cancelText}>← Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  infoBoxText: {
    color: '#0369a1',
    fontSize: 12,
    flex: 1,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  totpInput: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#64748b',
    fontSize: 12,
  },
  successContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  successMessage: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  cancelLink: {
    marginTop: 20,
    padding: 8,
  },
  cancelText: {
    color: '#64748b',
    fontSize: 13,
  },
});
