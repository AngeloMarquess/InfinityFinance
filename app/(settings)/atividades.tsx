import { View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';

export default function AtividadesScreen() {
  return (
    <View className="flex-1 max-w-4xl mx-auto w-full mb-10">
      <View className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm shadow-black/5 dark:shadow-none overflow-hidden min-h-[500px] border border-gray-100 dark:border-zinc-800/50">
        
        {/* Header */}
        <View className="p-8 pb-6 bg-white dark:bg-zinc-900">
          <Text className="text-[22px] font-bold text-gray-900 dark:text-white mb-2">Registro de atividades</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px]">Veja aqui o registro de atividades no sistema dos últimos 90 dias.</Text>
        </View>

        {/* Filter Bar */}
        <View className="bg-[#f08c32] dark:bg-[#d97c2a] px-8 py-4 flex-row items-center border-y border-[#d97c2a]/20">
           <Pressable className="flex-row items-center mr-8 hover:opacity-80 transition-opacity">
              <Text className="text-white font-bold text-sm mr-2">Todas as contas</Text>
              <SymbolView name={{ ios: 'chevron.down', android: 'arrow_drop_down', web: 'arrow_drop_down' }} tintColor="#fff" size={16} />
           </Pressable>
           <Pressable className="flex-row items-center hover:opacity-80 transition-opacity">
              <Text className="text-white font-bold text-sm mr-2">Todas as categorias</Text>
              <SymbolView name={{ ios: 'chevron.down', android: 'arrow_drop_down', web: 'arrow_drop_down' }} tintColor="#fff" size={16} />
           </Pressable>
        </View>

        {/* Empty State */}
        <View className="p-8 pb-32">
           <Text className="text-gray-800 dark:text-gray-300 font-medium text-[15px]">Nenhum registro encontrado.</Text>
        </View>

      </View>
    </View>
  );
}
