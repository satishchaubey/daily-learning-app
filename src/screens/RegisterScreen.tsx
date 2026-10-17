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
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, User, Phone, Cpu, ArrowRight, KeyRound, Copy, Check } from 'lucide-react-native';

export const RegisterScreen = ({ navigation }: any) => {
  const { register, verifyTotpSetup } = useAuth();

  const [step, setStep] = useState<'form' | 'totp'>('form');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');

  const [totpData, setTotpData] = useState<{
    qrCode: string;
    manualEntryKey: string;
    otpAuthUrl: string;
  } | null>(null);

  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await register(username.trim(), email.trim().toLowerCase(), password, phone.trim() || undefined);
      setTotpData(res.totpSetup);
      setStep('totp');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTotp = async () => {
    if (totpCode.trim().length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyTotpSetup(email.trim().toLowerCase(), totpCode.trim());
    } catch (err: any) {
      setError(err.message || 'Invalid code. Check Google Authenticator.');
    } finally {
      setLoading(false);
    }
  };

  const copyKey = async () => {
    if (totpData?.manualEntryKey) {
      await Clipboard.setStringAsync(totpData.manualEntryKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            <Text style={styles.subtitle}>Level Up Your Engineering Skills</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {step === 'form' ? 'Create Account' : 'Setup Google Authenticator'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {step === 'form'
                ? 'Join thousands of senior engineers'
                : 'Scan the QR code with Google Authenticator'}
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {step === 'form' ? (
              <View style={styles.form}>
                <Text style={styles.label}>FULL NAME</Text>
                <View style={styles.inputContainer}>
                  <User size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Alex Rivera"
                    placeholderTextColor="#94a3b8"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>

                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <View style={styles.inputContainer}>
                  <Mail size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="alex@example.com"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <Text style={styles.label}>PHONE NUMBER (OPTIONAL)</Text>
                <View style={styles.inputContainer}>
                  <Phone size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="+91 9876543210"
                    placeholderTextColor="#94a3b8"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.inputContainer}>
                  <Lock size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="At least 8 characters"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <Text style={styles.label}>CONFIRM PASSWORD</Text>
                <View style={styles.inputContainer}>
                  <Lock size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter password"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.primaryButtonText}>Next: 2FA Setup</Text>
                      <ArrowRight size={16} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.qrContainer}>
                  {totpData?.otpAuthUrl ? (
                    <QRCode
                      value={totpData.otpAuthUrl}
                      size={160}
                      color="#0f172a"
                      backgroundColor="#ffffff"
                    />
                  ) : (
                    <ActivityIndicator size="large" color="#0f172a" />
                  )}
                  <Text style={styles.qrSubtext}>Scan with Google Authenticator</Text>
                </View>

                {totpData?.manualEntryKey ? (
                  <View style={styles.manualKeyRow}>
                    <Text style={styles.manualKeyText} numberOfLines={1}>
                      {totpData.manualEntryKey}
                    </Text>
                    <TouchableOpacity style={styles.copyBtn} onPress={copyKey}>
                      {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} color="#0f172a" />}
                    </TouchableOpacity>
                  </View>
                ) : null}

                <Text style={styles.label}>ENTER 6-DIGIT CODE FROM APP</Text>
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
                    <Text style={styles.primaryButtonText}>Activate Account</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => setStep('form')}>
                  <Text style={styles.backButtonText}>← Edit Registration Details</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
  form: {
    gap: 10,
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
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  qrSubtext: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 10,
  },
  manualKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  manualKeyText: {
    flex: 1,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#334155',
  },
  copyBtn: {
    padding: 4,
    marginLeft: 6,
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
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
  },
  footerLink: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
});
