import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function signUpWithEmail() {
    setMessage({ type: '', text: '' });
    
    if (!agreed) {
      setMessage({ type: 'error', text: 'Você precisa concordar com os Termos de Uso.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Sua senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: email.split('@')[0],
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setMessage({ type: 'error', text: 'Este e-mail já está cadastrado. Faça login.' });
        } else {
          setMessage({ type: 'error', text: error.message });
        }
      } else {
        if (data.session) {
          router.replace('/onboarding');
        } else {
          // Tenta fazer o login forçado logo após o cadastro para ver o que a API responde
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });
          
          if (loginError) {
             // O erro real do Supabase provando que ele barrou a entrada
             setMessage({ type: 'error', text: `Bloqueado pelo Supabase: "${loginError.message}". Certifique-se de SALVAR a alteração (Confirm Email) lá na tela de Auth > Providers, e tente usar um e-mail novo que nunca foi digitado.` });
          } else if (loginData.session) {
             // Foi só um delay do sistema em retornar a sessão. Entrou com sucesso!
             router.replace('/onboarding');
          } else {
             setMessage({ type: 'success', text: 'Conta criada! Mas o Supabase não autorizou entrar sem confirmar o e-mail.' });
          }
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro inesperado: ' + err.message });
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-[#f7f9fa] dark:bg-zinc-950"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        
        {/* Logo Section */}
        <View className="items-center mb-8 mt-12">
          <View className="flex-row items-center">
            <SymbolView name={{ ios: 'circle.circle.fill', android: 'lens', web: 'lens' }} tintColor="#24c45c" size={32} />
            <Text className="text-gray-800 dark:text-white text-3xl font-bold ml-2 tracking-tight">infinity finance</Text>
          </View>
        </View>

        {/* Central Card */}
        <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm shadow-black/5 dark:shadow-none w-full max-w-md mx-auto">
          <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">Crie sua conta</Text>

          {message.text ? (
            <View className={`p-4 rounded-xl mb-6 ${message.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-brand-green'}`}>
              <Text className={`${message.type === 'error' ? 'text-red-600' : 'text-brand-green'} text-sm font-medium text-center`}>
                {message.text}
              </Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View className="mb-4">
            <View className="flex-row mb-2">
              <Text className="text-gray-900 dark:text-gray-300 font-medium text-sm">E-mail</Text>
              <Text className="text-brand-green font-bold ml-1">*</Text>
            </View>
            <View className="border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-brand-green bg-white dark:bg-zinc-800 justify-center">
              <TextInput 
                className="w-full text-gray-900 dark:text-white outline-none"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined}
                placeholder="Adicionar seu e-mail"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <View className="flex-row mb-2">
              <Text className="text-gray-900 dark:text-gray-300 font-medium text-sm">Senha</Text>
              <Text className="text-brand-green font-bold ml-1">*</Text>
            </View>
            <View className="flex-row items-center border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-brand-green bg-white dark:bg-zinc-800 justify-center">
              <TextInput 
                className="flex-1 text-gray-900 dark:text-white outline-none"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined}
                placeholder="Criar sua senha"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} className="pl-3 py-2">
                <SymbolView 
                  name={{ 
                    ios: showPassword ? 'eye.slash' : 'eye', 
                    android: showPassword ? 'visibility_off' : 'visibility', 
                    web: showPassword ? 'visibility_off' : 'visibility' 
                  }} 
                  tintColor="#9ca3af" 
                  size={20} 
                />
              </Pressable>
            </View>
          </View>

          <Text className="text-gray-400 text-sm mb-6 mt-1">Sua senha deve ter no mínimo 6 caracteres</Text>

          {/* Terms Checkbox */}
          <View className="flex-row items-center mb-6">
            <Pressable 
              onPress={() => setAgreed(!agreed)}
              className={`w-6 h-6 rounded border items-center justify-center mr-3 ${agreed ? 'bg-brand-green border-brand-green' : 'border-gray-300 dark:border-zinc-700 bg-transparent'}`}
            >
              {agreed && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#fff" size={14} />}
            </Pressable>
            <View className="flex-row flex-1 flex-wrap items-center">
              <Text className="text-gray-800 dark:text-gray-300 text-[15px]">Li e concordo com os </Text>
              <Link href="/termos" asChild>
                <Pressable>
                  <Text className="text-gray-800 dark:text-gray-300 text-[15px] underline">termos de uso</Text>
                </Pressable>
              </Link>
              <Text className="text-brand-green font-bold ml-1">*</Text>
            </View>
          </View>

          {/* Signup Button */}
          <Pressable 
            onPress={signUpWithEmail}
            disabled={loading}
            className="bg-[#24c45c] h-12 rounded-xl items-center justify-center active:bg-[#1a9344]"
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Criar conta</Text>}
          </Pressable>

          {/* Footer Card */}
          <View className="flex-row justify-center mt-6 items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-[15px]">Já sou cadastrado. </Text>
            <Link href="/login" asChild>
              <Pressable disabled={loading}>
                <Text className="text-brand-green font-medium text-[15px]">Quero fazer login</Text>
              </Pressable>
            </Link>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
