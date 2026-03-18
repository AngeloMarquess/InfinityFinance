import { ScrollView, Text, View, Pressable, ActivityIndicator, Platform, Dimensions, Modal } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DashboardScreen() {
  const [userName, setUserName] = useState('');
  const [initials, setInitials] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSteps, setShowSteps] = useState(false);
  const [showTopSettingsMenu, setShowTopSettingsMenu] = useState(false);
  const [showGastosMenu, setShowGastosMenu] = useState(false);
  const [isGastosExpanded, setIsGastosExpanded] = useState(true);
  const [isPagarExpanded, setIsPagarExpanded] = useState(true);
  const [isReceberExpanded, setIsReceberExpanded] = useState(true);
  const [isLimitesExpanded, setIsLimitesExpanded] = useState(true);
  const [isContasExpanded, setIsContasExpanded] = useState(true);
  const [isCartoesExpanded, setIsCartoesExpanded] = useState(true);
  const [isBlogExpanded, setIsBlogExpanded] = useState(true);
  const [gastosPeriodo, setGastosPeriodo] = useState('atual');
  const [gastosCartao, setGastosCartao] = useState('compra');
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }

      const fullname = user.user_metadata?.full_name || 'Usuário';
      setUserName(fullname);
      setInitials(fullname.substring(0, 2).toUpperCase());

      const { data: accountsData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);
        
      setAccounts(accountsData || []);
    } catch (error) {
      console.log('Error fetching user data', error);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  const saldoGeral = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const iconTime = hour >= 18 ? '🌙' : '☁️';

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 items-center justify-center">
        <ActivityIndicator size="large" color="#24c45c" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#f4f6f8] dark:bg-zinc-950" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Top Navbar */}
      <View className="hidden md:flex bg-[#24c45c] w-full px-8 py-3 flex-row items-center justify-between z-20">
        <View className="flex-row items-center gap-x-8">
          <View className="flex-row items-center">
            <SymbolView name={{ ios: 'circle.circle.fill', android: 'lens', web: 'lens' }} tintColor="#fff" size={28} />
            <Text className="text-white text-xl font-bold ml-2">infinity finance</Text>
          </View>
          <View className="flex-row gap-x-6 items-center pt-1">
             <Text className="text-white font-bold opacity-100 border-b-2 border-white pb-1">visão geral</Text>
             <Text className="text-white font-medium opacity-80 cursor-pointer hover:opacity-100 pb-1">lançamentos</Text>
             <Text className="text-white font-medium opacity-80 cursor-pointer hover:opacity-100 pb-1">relatórios</Text>
             <Text className="text-white font-medium opacity-80 cursor-pointer hover:opacity-100 pb-1">limite de gastos</Text>
             <Text className="text-white font-medium opacity-80 cursor-pointer hover:opacity-100 pb-1">conexão bancária</Text>
          </View>
        </View>
        
        <View className="flex-row items-center gap-x-5 relative">
           <Pressable onPress={() => setShowTopSettingsMenu(!showTopSettingsMenu)}>
             <SymbolView name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }} tintColor="#fff" size={20} />
           </Pressable>
           
           {/* Top Settings Dropdown */}
           {showTopSettingsMenu && (
             <View className="absolute top-10 right-10 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl shadow-black/20 border border-gray-100 dark:border-zinc-700 py-2 z-50">
               <View className="absolute -top-[5px] right-[18px] w-3 h-3 bg-white dark:bg-zinc-800 rotate-45 border-t border-l border-gray-100 dark:border-zinc-700" />
               <Link href="/(settings)/categorias" asChild><Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Categorias</Text></Pressable></Link>
               <Link href="/(settings)/contas" asChild><Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Contas</Text></Pressable></Link>
               <Link href="/(settings)/cartoes" asChild><Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Cartões de crédito</Text></Pressable></Link>
               
               <View className="h-[1px] bg-gray-100 dark:bg-zinc-700/50 my-1 mx-4" />
               
               <Link href="/(settings)/preferencias" asChild><Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Preferências</Text></Pressable></Link>
               <Link href="/(settings)/plano" asChild><Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Meu Plano</Text></Pressable></Link>
               <Link href="/(settings)/tags" asChild><Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Tags</Text></Pressable></Link>
               <Link href="/(settings)/alertas" asChild><Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Alertas</Text></Pressable></Link>
               <Link href="/(settings)/atividades" asChild><Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-700 dark:text-gray-300 font-medium text-[15px]">Atividades</Text></Pressable></Link>

               <View className="h-[1px] bg-gray-100 dark:bg-zinc-700/50 my-1 mx-4" />
               <Pressable onPress={() => setShowTopSettingsMenu(false)} className="px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"><Text className="text-gray-500 font-medium text-[15px]">mais opções</Text></Pressable>
             </View>
           )}

           <SymbolView name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }} tintColor="#fff" size={20} />
           <Pressable onPress={signOut} className="w-8 h-8 rounded-full bg-white/20 items-center justify-center hover:bg-white/30 transition-colors">
             <SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' }} tintColor="#fff" size={16} />
           </Pressable>
        </View>
      </View>

      {/* Trial Banner */}
      <View className="hidden md:flex bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-8 py-2 flex-row items-center justify-between shadow-sm z-10 w-full mb-8">
         <View className="flex-row items-center gap-x-4 w-full">
           <View className="bg-gray-500 rounded px-2 py-[2px]"><Text className="text-white text-[11px] font-bold">Plano manual</Text></View>
           <Text className="text-sm font-bold text-gray-800 dark:text-gray-200">Teste grátis</Text>
           <Text className="text-sm text-gray-500 dark:text-gray-400">7 dias restantes</Text>
           <View className="flex-1 max-w-sm h-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full ml-2 overflow-hidden">
             <View className="w-[80%] h-full bg-yellow-400" />
           </View>
           <Text className="text-sm text-gray-500 font-medium ml-4 cursor-pointer hover:text-gray-800">Ver planos</Text>
         </View>
      </View>

      {/* Mobile Top Header (Since tabs hide web nav) */}
      <View className="flex md:hidden bg-[#24c45c] px-6 pt-16 pb-8 rounded-b-[30px] shadow-sm mb-6">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-x-3">
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-white text-lg font-bold">{initials}</Text>
            </View>
            <View>
              <Text className="text-white/80 text-sm font-medium">{greeting},</Text>
              <Text className="text-white text-xl font-bold">{userName}! {iconTime}</Text>
            </View>
          </View>
          <Pressable onPress={signOut} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <SymbolView name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }} tintColor="#fff" size={20} />
          </Pressable>
        </View>
      </View>

      {/* Main Grid Container */}
      <View className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6">

        {/* ROW 1: Welcome & Quick Access */}
        <View className="flex-col md:flex-row gap-4 md:gap-6">
          
          {/* Welcome Card */}
          <View className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
             <View className="hidden md:flex mb-6">
               <Text className="text-gray-500 dark:text-gray-400 text-sm">{greeting},</Text>
               <Text className="text-2xl font-bold text-gray-900 dark:text-white">{userName}! {iconTime}</Text>
             </View>
             
             <View className="flex-row items-end justify-between border-t border-gray-100 dark:border-zinc-800 pt-4 mt-auto">
               <View>
                 <Text className="text-gray-400 text-xs mb-1 font-medium">Receitas no mês atual</Text>
                 <Text className="text-[#24c45c] font-bold text-lg">R$ 0,00</Text>
               </View>
               <View>
                 <Text className="text-gray-400 text-xs mb-1 font-medium">Despesas no mês atual</Text>
                 <Text className="text-[#db4437] font-bold text-lg">R$ 0,00</Text>
               </View>
               <View className="w-10 h-10 border border-gray-200 dark:border-zinc-700 rounded-lg items-center justify-center">
                 <SymbolView name={{ ios: 'chart.bar.xaxis', android: 'bar_chart', web: 'bar_chart' }} tintColor="#9ca3af" size={20} />
               </View>
             </View>
          </View>

          {/* Quick Access Card */}
          <View className="flex-[0.8] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
            <Text className="text-center text-gray-800 dark:text-gray-200 font-bold mb-6">Acesso rápido</Text>
            <View className="flex-row justify-between pt-2">
              <View className="items-center w-16">
                 <View className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-700 items-center justify-center mb-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 transition-colors">
                   <SymbolView name={{ ios: 'minus.circle', android: 'remove_circle_outline', web: 'remove_circle_outline' }} tintColor="#db4437" size={24} />
                 </View>
                 <Text className="text-[10px] text-gray-500 font-bold uppercase">Despesa</Text>
              </View>
              <View className="items-center w-16">
                 <View className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-700 items-center justify-center mb-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 transition-colors">
                   <SymbolView name={{ ios: 'plus.circle', android: 'add_circle_outline', web: 'add_circle_outline' }} tintColor="#24c45c" size={24} />
                 </View>
                 <Text className="text-[10px] text-gray-500 font-bold uppercase">Receita</Text>
              </View>
              <View className="items-center w-16">
                 <View className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-700 items-center justify-center mb-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 transition-colors">
                   <SymbolView name={{ ios: 'arrow.left.arrow.right', android: 'swap_horiz', web: 'swap_horiz' }} tintColor="#9ca3af" size={22} />
                 </View>
                 <Text className="text-[10px] text-gray-500 font-bold uppercase">Transf.</Text>
              </View>
              <View className="items-center w-16">
                 <View className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-700 items-center justify-center mb-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 transition-colors">
                   <SymbolView name={{ ios: 'link', android: 'link', web: 'link' }} tintColor="#3b82f6" size={22} />
                 </View>
                 <Text className="text-[10px] text-gray-500 font-bold uppercase">Importar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ROW 2: Contas e Cartões */}
        <View className="flex-col md:flex-row gap-4 md:gap-6 mt-4">
          
          <View className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 border-l-4 border-l-[#24c45c] relative ${isContasExpanded ? '' : 'h-[72px] overflow-hidden'}`}>
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-x-2">
                 <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">Saldo geral</Text>
                 <Text className="text-lg font-bold text-gray-900 dark:text-white">R$ {saldoGeral.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</Text>
                 <SymbolView name={{ ios: 'eye', android: 'visibility', web: 'visibility' }} tintColor="#9ca3af" size={16} />
              </View>
              <Pressable onPress={() => setIsContasExpanded(!isContasExpanded)} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors absolute right-0 top-0">
                 <SymbolView name={{ ios: isContasExpanded ? 'arrowtriangle.up.fill' : 'arrowtriangle.down.fill', android: isContasExpanded ? 'arrow_drop_up' : 'arrow_drop_down', web: isContasExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }} tintColor="#6b7280" size={16} />
              </Pressable>
            </View>
            <Text className="text-gray-800 dark:text-gray-200 font-bold mb-8">Minhas contas</Text>
            
            {isContasExpanded && (
              <>
                <View className="items-center justify-center mb-8 flex-row pointer-events-none">
                   <View className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 items-center justify-center mr-3">
                     <Text className="text-gray-400 font-bold text-lg">$</Text>
                   </View>
                   <Text className="text-gray-400 dark:text-gray-500 font-medium">Adicione sua primeira conta</Text>
                </View>

                <View className="mt-auto border-t border-gray-100 dark:border-zinc-800 pt-4">
                  <Link href="/(settings)/contas" asChild>
                    <Pressable className="hover:opacity-70 transition-opacity flex-row justify-center">
                      <Text className="text-center text-gray-400 dark:text-gray-500 font-bold text-sm">Gerenciar contas</Text>
                    </Pressable>
                  </Link>
                </View>
              </>
            )}
          </View>

          <View className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 border-l-4 border-l-[#24c45c] relative ${isCartoesExpanded ? '' : 'h-[72px] overflow-hidden'}`}>
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-x-2">
                 <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">Todas as faturas</Text>
                 <Text className="text-lg font-bold text-gray-900 dark:text-white">R$ 0,00</Text>
                 <SymbolView name={{ ios: 'eye', android: 'visibility', web: 'visibility' }} tintColor="#9ca3af" size={16} />
              </View>
              <Pressable onPress={() => setIsCartoesExpanded(!isCartoesExpanded)} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors absolute right-0 top-0">
                 <SymbolView name={{ ios: isCartoesExpanded ? 'arrowtriangle.up.fill' : 'arrowtriangle.down.fill', android: isCartoesExpanded ? 'arrow_drop_up' : 'arrow_drop_down', web: isCartoesExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }} tintColor="#6b7280" size={16} />
              </Pressable>
            </View>
            <Text className="text-gray-800 dark:text-gray-200 font-bold mb-8">Meus cartões</Text>
            
            {isCartoesExpanded && (
              <>
                <View className="items-center justify-center mb-8 flex-row pointer-events-none">
                   <View className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 items-center justify-center mr-3">
                     <SymbolView name={{ ios: 'creditcard', android: 'credit_card', web: 'credit_card' }} tintColor="#9ca3af" size={20} />
                   </View>
                   <Text className="text-gray-400 dark:text-gray-500 font-medium">Adicione seu primeiro cartão</Text>
                </View>

                <View className="mt-auto border-t border-gray-100 dark:border-zinc-800 pt-4">
                  <Link href="/(settings)/cartoes" asChild>
                    <Pressable className="hover:opacity-70 transition-opacity flex-row justify-center">
                      <Text className="text-center text-gray-400 dark:text-gray-500 font-bold text-sm">Gerenciar cartões</Text>
                    </Pressable>
                  </Link>
                </View>
              </>
            )}
          </View>
        </View>

        {/* ROW 3 & 4 (Static Placeholders like React Native view) */}
        <View className="flex-col md:flex-row gap-4 md:gap-6 mt-4 relative" style={{ zIndex: showGastosMenu ? 50 : 20 }}>
           {/* Contas a pagar */}
           <View className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 relative ${isPagarExpanded ? 'h-40' : 'h-[72px] overflow-hidden'}`}>
             <View className="flex-row justify-between items-center mb-auto relative">
               <Text className="text-gray-800 dark:text-gray-200 font-bold">Contas a pagar</Text>
               <Pressable onPress={() => setIsPagarExpanded(!isPagarExpanded)} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  <SymbolView name={{ ios: isPagarExpanded ? 'arrowtriangle.up.fill' : 'arrowtriangle.down.fill', android: isPagarExpanded ? 'arrow_drop_up' : 'arrow_drop_down', web: isPagarExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }} tintColor="#6b7280" size={16} />
               </Pressable>
             </View>
             {isPagarExpanded && (
               <Text className="text-gray-400 text-center text-sm font-medium mb-auto mt-6 pointer-events-none">No momento você não possui contas a pagar</Text>
             )}
           </View>

           {/* Maiores gastos */}
           <View className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 relative ${isGastosExpanded ? 'h-40' : 'h-[72px]'}`} style={{ zIndex: showGastosMenu ? 50 : 1, overflow: showGastosMenu ? 'visible' : 'hidden' }}>
             <View className="flex-row justify-between items-center mb-auto relative">
               <Text className="text-gray-800 dark:text-gray-200 font-bold">Maiores gastos do mês atual</Text>
               <View className="flex-row items-center gap-x-2">
                 <Pressable onPress={() => setShowGastosMenu(!showGastosMenu)} className="w-7 h-7 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                    <SymbolView name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }} tintColor="#9ca3af" size={18} />
                 </Pressable>
                 <Pressable onPress={() => setIsGastosExpanded(!isGastosExpanded)} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                    <SymbolView name={{ ios: isGastosExpanded ? 'arrowtriangle.up.fill' : 'arrowtriangle.down.fill', android: isGastosExpanded ? 'arrow_drop_up' : 'arrow_drop_down', web: isGastosExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }} tintColor="#6b7280" size={16} />
                 </Pressable>
               </View>
             </View>
             
             {isGastosExpanded && (
               <Text className="text-gray-400 text-center text-sm font-medium mb-auto mt-6 pointer-events-none">Sem gastos no período</Text>
             )}

             {/* Popover Menu */}
             {showGastosMenu && (
               <View className="absolute top-16 right-6 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl shadow-black/20 border border-gray-100 dark:border-zinc-700 py-3 z-50">
                 
                 <Text className="text-[11px] font-bold text-gray-400 mb-2 px-5 tracking-wider">PERÍODO</Text>
                 
                 {[
                   { id: 'atual', label: 'do mês atual' },
                   { id: '15', label: 'dos últimos 15 dias' },
                   { id: '30', label: 'dos últimos 30 dias' },
                   { id: '3m', label: 'dos últimos 3 meses' },
                   { id: '6m', label: 'dos últimos 6 meses' },
                 ].map(opt => (
                   <Pressable 
                     key={opt.id} 
                     onPress={() => { setGastosPeriodo(opt.id); }} 
                     className="flex-row items-center justify-between px-5 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
                   >
                      <Text className={`font-medium text-[15px] ${gastosPeriodo === opt.id ? 'text-[#24c45c]' : 'text-gray-500 dark:text-gray-300'}`}>{opt.label}</Text>
                      {gastosPeriodo === opt.id && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#24c45c" size={14} />}
                   </Pressable>
                 ))}

                 <View className="h-[1px] bg-gray-100 dark:bg-zinc-700 my-3 mx-5" />

                 <Text className="text-[11px] font-bold text-gray-400 mb-2 px-5 tracking-wider">CARTÃO DE CRÉDITO</Text>
                 
                 {[
                   { id: 'compra', label: 'Data da compra' },
                   { id: 'fatura', label: 'Data da fatura' },
                 ].map(opt => (
                   <Pressable 
                     key={opt.id} 
                     onPress={() => { setGastosCartao(opt.id); setShowGastosMenu(false); }} 
                     className="flex-row items-center justify-between px-5 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
                   >
                      <Text className={`font-medium text-[15px] ${gastosCartao === opt.id ? 'text-[#24c45c]' : 'text-gray-500 dark:text-gray-300'}`}>{opt.label}</Text>
                      {gastosCartao === opt.id && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#24c45c" size={14} />}
                   </Pressable>
                 ))}

               </View>
             )}
           </View>
        </View>

        <View className="flex-col md:flex-row gap-4 md:gap-6 mt-4 relative" style={{ zIndex: 10 }}>
           {/* Contas a receber */}
           <View className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 relative ${isReceberExpanded ? 'h-40' : 'h-[72px] overflow-hidden'}`}>
             <View className="flex-row justify-between items-center mb-auto relative">
               <Text className="text-gray-800 dark:text-gray-200 font-bold">Contas a receber</Text>
               <Pressable onPress={() => setIsReceberExpanded(!isReceberExpanded)} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  <SymbolView name={{ ios: isReceberExpanded ? 'arrowtriangle.up.fill' : 'arrowtriangle.down.fill', android: isReceberExpanded ? 'arrow_drop_up' : 'arrow_drop_down', web: isReceberExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }} tintColor="#6b7280" size={16} />
               </Pressable>
             </View>
             {isReceberExpanded && (
               <Text className="text-gray-400 text-center text-sm font-medium mb-auto mt-6 pointer-events-none">Você não possui contas a receber pendentes</Text>
             )}
           </View>
           
           {/* Limites */}
           <View className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 relative ${isLimitesExpanded ? 'h-40' : 'h-[72px] overflow-hidden'}`}>
             <View className="flex-row justify-between items-center mb-auto relative">
               <Text className="text-gray-800 dark:text-gray-200 font-bold">Limite de gastos de {new Date().toLocaleString('pt-BR', { month: 'long' })}</Text>
               <Pressable onPress={() => setIsLimitesExpanded(!isLimitesExpanded)} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  <SymbolView name={{ ios: isLimitesExpanded ? 'arrowtriangle.up.fill' : 'arrowtriangle.down.fill', android: isLimitesExpanded ? 'arrow_drop_up' : 'arrow_drop_down', web: isLimitesExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }} tintColor="#6b7280" size={16} />
               </Pressable>
             </View>
             {isLimitesExpanded && (
               <Text className="text-gray-400 text-center text-sm font-medium mb-auto mt-6 pointer-events-none">Nenhum Limite de Gasto definido para o período</Text>
             )}
           </View>
        </View>

        {/* ROW 5 Blog Placeholder */}
        <View className="mt-8 mb-4 w-full md:w-1/2">
           <View className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 relative ${isBlogExpanded ? '' : 'h-[72px] overflow-hidden'}`}>
             <View className="flex-row items-center justify-between mb-auto relative">
               <Text className="text-gray-800 dark:text-gray-200 font-bold">Conteúdos do blog</Text>
               <Pressable onPress={() => setIsBlogExpanded(!isBlogExpanded)} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors absolute right-0 top-0">
                  <SymbolView name={{ ios: isBlogExpanded ? 'arrowtriangle.up.fill' : 'arrowtriangle.down.fill', android: isBlogExpanded ? 'arrow_drop_up' : 'arrow_drop_down', web: isBlogExpanded ? 'arrow_drop_up' : 'arrow_drop_down' }} tintColor="#6b7280" size={16} />
               </Pressable>
             </View>

             {isBlogExpanded && (
               <View className="w-full flex-row gap-4 mt-6 pointer-events-none">
                 <View className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                 <View className="flex-1 justify-center">
                   <Text className="text-gray-900 dark:text-white font-bold text-sm leading-relaxed">Imposto de Renda 2026: Guia completo para declarar sem erros</Text>
                   <Text className="text-[#24c45c] text-xs font-bold mt-2">Ler artigo</Text>
                 </View>
               </View>
             )}
           </View>
        </View>

        {/* Floating Help Button Mimic (Web Only) */}
        <Pressable onPress={() => setShowSteps(true)} className="hidden md:flex absolute bottom-8 right-8 bg-[#24c45c] rounded-full px-6 py-3 flex-row items-center shadow-lg hover:bg-[#1a9344] transition-colors z-30">
          <SymbolView name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }} tintColor="#fff" size={16} />
          <Text className="text-white font-bold ml-2">Primeiros passos</Text>
        </Pressable>

        {/* Modal de Primeiros Passos */}
        <Modal visible={showSteps} transparent animationType="fade">
          <View className="flex-1 bg-black/40 justify-center items-center p-4">
            <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-[450px] shadow-2xl relative">
              
              {/* Fechar */}
              <Pressable onPress={() => setShowSteps(false)} className="absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors z-10">
                <Text className="text-gray-400 dark:text-gray-500 font-bold">X</Text>
              </Pressable>

              {/* Cabeçalho */}
              <View className="items-center mb-8 mt-2">
                <View className="w-12 h-12 rounded-full bg-[#24c45c] items-center justify-center mb-4">
                   <SymbolView name={{ ios: 'point.topleft.down.curvedto.point.bottomright.up', android: 'timeline', web: 'timeline' }} tintColor="#fff" size={24} />
                </View>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Primeiros passos</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">Comece a configurar seu Infinity Finance por aqui</Text>
              </View>

              {/* Barra de Progresso */}
              <View className="flex-row items-center mb-8 px-2">
                <Text className="text-gray-500 dark:text-gray-400 font-bold mr-4 text-sm">25%</Text>
                <View className="flex-1 h-[22px] bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <View className="w-1/4 h-full bg-[#24c45c] rounded-full" />
                </View>
              </View>

              {/* Lista de Tarefas */}
              <View className="px-4 pb-2">
                
                {/* Tarefa 1 */}
                <View className="flex-row items-center py-4 border-b border-gray-100 dark:border-zinc-800/50">
                   <View className="w-6 h-6 rounded-md bg-[#24c45c] items-center justify-center mr-4">
                     <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#fff" size={14} />
                   </View>
                   <Text className="text-gray-700 dark:text-gray-200 text-[15px] font-medium">Você criou sua conta no Infinity Finance</Text>
                </View>

                {/* Tarefa 2 */}
                <Link href="/(settings)/contas" asChild>
                  <Pressable onPress={() => setShowSteps(false)} className="flex-row items-center py-4 border-b border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                     <View className="w-6 h-6 rounded-md bg-gray-200 dark:bg-zinc-800 items-center justify-center mr-4" />
                     <Text className="text-gray-600 dark:text-gray-300 text-[15px] font-medium">Adicione contas bancárias</Text>
                  </Pressable>
                </Link>

                {/* Tarefa 3 */}
                <Link href="/(settings)/cartoes" asChild>
                  <Pressable onPress={() => setShowSteps(false)} className="flex-row items-center py-4 border-b border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                     <View className="w-6 h-6 rounded-md bg-gray-200 dark:bg-zinc-800 items-center justify-center mr-4" />
                     <Text className="text-gray-600 dark:text-gray-300 text-[15px] font-medium">Configure um cartão de crédito</Text>
                  </Pressable>
                </Link>

                {/* Tarefa 4 */}
                <Link href="/(settings)/categorias" asChild>
                  <Pressable onPress={() => setShowSteps(false)} className="flex-row items-center py-4 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                     <View className="w-6 h-6 rounded-md bg-gray-200 dark:bg-zinc-800 items-center justify-center mr-4" />
                     <Text className="text-gray-600 dark:text-gray-300 text-[15px] font-medium">Baixe o app do Infinity Finance</Text>
                  </Pressable>
                </Link>

              </View>

            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}
