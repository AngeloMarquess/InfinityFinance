import { View, Text, ScrollView, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';

export default function LançamentosScreen() {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      {/* Header Month Selector */}
      <View className="pt-16 pb-6 px-6 bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-100 dark:border-zinc-800 z-10 flex-row items-center justify-between">
        <Pressable className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-zinc-800">
          <SymbolView name={{ ios: 'chevron.left', android: 'chevron-left', web: 'chevron-left' }} tintColor="#6b7280" size={20} />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 dark:text-white">Novembro</Text>
        <Pressable className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-zinc-800">
          <SymbolView name={{ ios: 'chevron.right', android: 'chevron-right', web: 'chevron-right' }} tintColor="#6b7280" size={20} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }} className="px-5">
        
        {/* Sumário Rápido */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-red-50 dark:bg-red-900/20 p-4 rounded-3xl border border-red-100 dark:border-red-900/50">
            <SymbolView name={{ ios: 'arrow.down.right', android: 'call-received', web: 'call-received' }} tintColor="#ef4444" size={20} />
            <Text className="text-red-500 text-xs font-semibold mt-2">Despesas</Text>
            <Text className="text-red-600 dark:text-red-400 font-bold text-lg mt-1">R$ 4.320,00</Text>
          </View>
          <View className="flex-1 bg-brand-green/10 dark:bg-brand-green/20 p-4 rounded-3xl border border-brand-green/20 dark:border-brand-green/30">
            <SymbolView name={{ ios: 'arrow.up.forward', android: 'call-made', web: 'call-made' }} tintColor="#24c45c" size={20} />
            <Text className="text-brand-green text-xs font-semibold mt-2">Receitas</Text>
            <Text className="text-brand-darkGreen dark:text-brand-green font-bold text-lg mt-1">R$ 9.800,00</Text>
          </View>
        </View>

        {/* Section: Hoje */}
        <Text className="text-gray-500 dark:text-gray-400 font-semibold mb-3 px-1">Hoje, 18 de Nov</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-3xl p-2 mb-6 shadow-sm shadow-black/5 dark:shadow-none">
          
          <Pressable className="flex-row items-center justify-between p-4 active:bg-gray-50 dark:active:bg-zinc-800/50 rounded-2xl">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-2xl items-center justify-center mr-4">
                <SymbolView name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }} tintColor="#f97316" size={20} />
              </View>
              <View>
                <Text className="font-semibold text-gray-900 dark:text-white text-[15px]">Almoço Restaurante</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Alimentação • Cartão Nubank</Text>
              </View>
            </View>
            <Text className="text-gray-900 dark:text-white font-bold">-R$ 84,90</Text>
          </Pressable>

          <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 mx-4" />

          <Pressable className="flex-row items-center justify-between p-4 active:bg-gray-50 dark:active:bg-zinc-800/50 rounded-2xl">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl items-center justify-center mr-4">
                <SymbolView name={{ ios: 'car.fill', android: 'directions-car', web: 'directions-car' }} tintColor="#3b82f6" size={20} />
              </View>
              <View>
                <Text className="font-semibold text-gray-900 dark:text-white text-[15px]">Uber</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Transporte • Cartão Itaú</Text>
              </View>
            </View>
            <Text className="text-gray-900 dark:text-white font-bold">-R$ 29,50</Text>
          </Pressable>
        </View>


        {/* Section: Ontem */}
        <Text className="text-gray-500 dark:text-gray-400 font-semibold mb-3 px-1">Ontem, 17 de Nov</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-3xl p-2 shadow-sm shadow-black/5 dark:shadow-none">
          
          <Pressable className="flex-row items-center justify-between p-4 active:bg-gray-50 dark:active:bg-zinc-800/50 rounded-2xl">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-2xl items-center justify-center mr-4">
                <SymbolView name={{ ios: 'briefcase.fill', android: 'work', web: 'work' }} tintColor="#22c55e" size={20} />
              </View>
              <View>
                <Text className="font-semibold text-gray-900 dark:text-white text-[15px]">Salário da Empresa</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Receita • Conta Santander</Text>
              </View>
            </View>
            <Text className="text-brand-green font-bold">+R$ 9.800,00</Text>
          </Pressable>
          
        </View>

      </ScrollView>

      {/* Floating Action Button for new Record */}
      <Pressable className="absolute bottom-6 right-6 w-14 h-14 bg-brand-green rounded-full items-center justify-center shadow-lg shadow-brand-green/40 active:bg-brand-darkGreen">
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor="#ffffff" size={28} />
      </Pressable>
    </View>
  );
}
