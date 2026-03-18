import { View, Text, ScrollView, Platform, Pressable } from 'react-native';
import { Slot, Link, usePathname, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function SettingsLayout() {
  const pathname = usePathname();
  const isWeb = Platform.OS === 'web';

  const NavItem = ({ label, href }: { label: string, href: string }) => {
    // pathname can be /contas, but _layout is in /(settings). So the href might be /(settings)/contas
    // To match accurately, we check if pathname includes the segment
    const isActive = pathname.includes(href.replace('/(settings)', ''));
    
    return (
      <Link href={href as any} asChild>
        <Pressable className={`flex-row items-center py-3 px-4 rounded-lg mb-1 ${isActive ? 'bg-transparent' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'} transition-colors relative`}>
          {isActive && <View className="w-1.5 h-1.5 rounded-full bg-[#24c45c] absolute left-0 ml-[6px]" />}
          <Text className={`${isActive ? 'text-[#24c45c] font-medium' : 'text-gray-600 dark:text-gray-400'} text-[15px]`}>{label}</Text>
        </Pressable>
      </Link>
    );
  };

  return (
    <View className="flex-1 bg-[#f7f9fa] dark:bg-zinc-950 flex-col md:flex-row">
      
      {/* Sidebar for Desktop / Hidden on Mobile (but can be shown if arranged) */}
      <View className={`${isWeb ? 'w-64 border-r' : 'w-full border-b'} border-gray-200 dark:border-zinc-800 bg-[#f7f9fa] dark:bg-zinc-950 p-6`}>
        {/* Back Button */}
        <Pressable onPress={() => router.replace('/(tabs)')} className="flex-row items-center mb-8 hover:opacity-70 transition-opacity">
          <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} tintColor="#6b7280" size={20} />
          <Text className="text-gray-500 ml-2 font-medium">Voltar ao Painel</Text>
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false}>
          <NavItem label="Categorias" href="/(settings)/categorias" />
          <NavItem label="Contas" href="/(settings)/contas" />
          <NavItem label="Cartões de crédito" href="/(settings)/cartoes" />
          
          <View className="h-[1px] bg-gray-200 dark:bg-zinc-800 my-4" />
          
          <NavItem label="Preferências" href="/(settings)/preferencias" />
          <NavItem label="Plano" href="/(settings)/plano" />
          <NavItem label="Tags" href="/(settings)/tags" />
          <NavItem label="Alertas" href="/(settings)/alertas" />
          <NavItem label="Atividades" href="/(settings)/atividades" />
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 p-4 md:p-8">
        <Slot />
      </View>
    </View>
  );
}
