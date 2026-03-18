import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!name.trim()) return;
    setLoading(true);
    
    // Atualiza o nome no metadata do Supabase Auth
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() }
    });

    setLoading(false);
    if (!error) {
      router.replace('/(tabs)');
    } else {
      alert('Erro ao salvar o nome: ' + error.message);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-[#f7f9fa] dark:bg-zinc-950">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Top Green Bar */}
      <View className="bg-[#24c45c] h-16 justify-center px-6 shadow-sm z-10">
        <View className="flex-row items-center">
          <SymbolView name={{ ios: 'circle.circle.fill', android: 'lens', web: 'lens' }} tintColor="#fff" size={24} />
          <Text className="text-white text-xl font-bold ml-2 tracking-tight">infinity finance</Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center p-6">
        <View className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl shadow-black/5 dark:shadow-none max-w-4xl w-full flex-row">
          
          {/* Left Column (Form) */}
          <View className="flex-1 p-8 md:p-12 justify-center">
            <Text className="text-[26px] font-extrabold text-gray-900 dark:text-white mb-2">Começando sua jornada!</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-[16px] mb-12 leading-relaxed">
              Que bom que você chegou até aqui.{'\n'}Vamos nos conhecer melhor?
            </Text>

            <View className="mb-6">
              <Text className="text-gray-900 dark:text-gray-300 font-bold text-sm mb-3">Como podemos te chamar?</Text>
              <View className="border border-gray-200 dark:border-zinc-700 rounded-xl h-14 px-4 focus-within:border-[#24c45c] focus:border-[#24c45c] bg-white dark:bg-zinc-800 justify-center">
                <TextInput 
                  className="w-full text-gray-900 dark:text-white text-[16px] outline-none"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined}
                  placeholder="Seu nome ou apelido"
                  placeholderTextColor="#d1d5db"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />
              </View>
            </View>

            <Pressable 
              onPress={handleContinue}
              disabled={loading || !name.trim()}
              className={`h-14 rounded-xl items-center justify-center transition-colors ${name.trim() ? 'bg-[#e5e7eb] dark:bg-zinc-800' : 'bg-[#f3f4f6] dark:bg-zinc-800/50'}`}
              style={name.trim() ? { backgroundColor: '#e5e7eb' } : {}}
            >
              {loading ? <ActivityIndicator color="#9ca3af" /> : <Text className={`font-bold text-base ${name.trim() ? 'text-gray-500' : 'text-gray-400'}`}>Continuar</Text>}
            </Pressable>
          </View>

          {/* Right Column (Illustration) */}
          <View className="hidden md:flex flex-[0.8] items-center justify-center bg-[#f0fdf4] dark:bg-[#0f291e]">
            <Image 
              source={require('../assets/images/onboarding_illustration.png')} 
              style={{ width: '100%', height: '100%', maxWidth: 400, maxHeight: 400 }} 
              resizeMode="contain" 
            />
          </View>

        </View>
      </View>

    </KeyboardAvoidingView>
  );
}
