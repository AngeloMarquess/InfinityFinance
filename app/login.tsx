import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState('');

  // Sign In
  async function signInWithEmail() {
    setMessage('');
    if (!agreed) {
      setMessage('Você precisa concordar com os Termos de Uso para continuar.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos' : error.message);
      setLoading(false);
    } else {
      router.replace('/(tabs)');
    }
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
          <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">Acesse sua conta</Text>

          {message ? (
            <View className="p-4 rounded-xl mb-6 bg-red-50 border border-red-200">
              <Text className="text-red-600 text-sm font-medium text-center">{message}</Text>
            </View>
          ) : null}

          {/* Google Button */}
          <Pressable className="flex-row items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-[#db4437]/20 hover:border-[#db4437] rounded-xl h-12 mb-6 transition-colors">
            <FontAwesome name="google" size={20} color="#db4437" style={{ marginRight: 10 }} />
            <Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Entrar com conta Google</Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-gray-200 dark:bg-zinc-800" />
            <Text className="px-4 text-gray-400 text-sm">ou</Text>
            <View className="flex-1 h-[1px] bg-gray-200 dark:bg-zinc-800" />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <View className="flex-row mb-2">
              <Text className="text-gray-900 dark:text-gray-300 font-medium text-sm">E-mail</Text>
              <Text className="text-brand-green font-bold ml-1">*</Text>
            </View>
            <View className="border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-brand-green bg-white dark:bg-zinc-900 justify-center">
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
            <View className="flex-row items-center border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-brand-green bg-white dark:bg-zinc-900 justify-center">
              <TextInput 
                className="flex-1 text-gray-900 dark:text-white outline-none"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined}
                placeholder="Adicionar sua senha"
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

          <Pressable className="mt-2 mb-6 self-start p-1 -ml-1">
            <Text className="text-gray-500 text-sm">Esqueci minha senha</Text>
          </Pressable>

          {/* Terms Checkbox */}
          <View className="flex-row items-center mb-6">
            <Pressable 
              onPress={() => setAgreed(!agreed)}
              className={`w-6 h-6 rounded border items-center justify-center mr-3 ${agreed ? 'bg-[#24c45c] border-[#24c45c]' : 'border-gray-300 dark:border-zinc-700 bg-transparent'}`}
            >
              {agreed && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#fff" size={14} />}
            </Pressable>
            <View className="flex-row flex-1 flex-wrap items-center">
              <Text className="text-gray-800 dark:text-gray-300 text-[14px]">Li e concordo com os </Text>
              <Link href="/termos" asChild>
                <Pressable>
                  <Text className="text-gray-800 dark:text-gray-300 text-[14px] underline font-medium">termos de uso</Text>
                </Pressable>
              </Link>
              <Text className="text-brand-green font-bold ml-1">*</Text>
            </View>
          </View>

          {/* Login Button */}
          <Pressable 
            onPress={signInWithEmail}
            disabled={loading}
            className="bg-brand-green h-12 rounded-xl items-center justify-center active:bg-brand-darkGreen"
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Entrar</Text>}
          </Pressable>

          {/* Footer Card */}
          <View className="flex-row justify-center mt-6 items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">Ainda não possui uma conta? </Text>
            <Link href="/signup" asChild>
              <Pressable disabled={loading}>
                <Text className="text-brand-green font-bold text-sm">Faça o cadastro!</Text>
              </Pressable>
            </Link>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
