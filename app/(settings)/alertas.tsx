import { View, Text, Pressable, Platform, Alert } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';

const DayBadge = ({ day, active, onPress }: any) => (
  <Pressable 
    onPress={onPress}
    className={`w-[42px] h-[42px] rounded-full items-center justify-center mr-2 mb-2 border hover:border-[#24c45c] transition-colors ${active ? 'bg-[#24c45c] border-[#24c45c]' : 'bg-transparent border-gray-200 dark:border-zinc-700'}`}
  >
    <Text className={`font-medium text-[13px] ${active ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>{day}</Text>
  </Pressable>
);

export default function AlertasScreen() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [activeDays, setActiveDays] = useState(['Seg']);

  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const toggleDay = (d: string) => {
    setActiveDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const notifyDesktop = () => {
    if (Platform.OS === 'web') {
      if ('Notification' in window) {
         window.Notification.requestPermission().then(p => {
            if (p === 'granted') new window.Notification('Infinity Finance', { body: 'Notificações Ativadas!' });
         });
      } else {
         window.alert('Seu navegador não suporta notificações web.');
      }
    } else {
      Alert.alert('Notificações', 'As permissões devem ser dadas nos Ajustes do aparelho celular.');
    }
  };

  return (
    <View className="flex-1 max-w-4xl mx-auto w-full">
      <View className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm shadow-black/5 dark:shadow-none p-6 sm:p-10 min-h-[500px] border border-gray-100 dark:border-zinc-800/50 mb-10">
        
        {/* Header */}
        <View className="mb-10">
          <Text className="text-[22px] font-bold text-gray-900 dark:text-white mb-2">Alertas</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px]">Receba alertas de contas a pagar, receber e metas.</Text>
        </View>

        {/* Desktop Section */}
        <View className="py-6 border-b border-gray-100 dark:border-zinc-800/50">
           <Text className="text-gray-800 dark:text-gray-200 font-bold text-[15px] mb-2">Pelo Desktop (computador)</Text>
           <Text className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">Veja seus alertas no canto da tela do computador, mesmo quando o site estiver fechado</Text>
           
           <View className="flex-row items-center">
             <View className="w-[52px] h-[52px] rounded-2xl bg-white dark:bg-zinc-800 items-center justify-center mr-4 border border-gray-100 dark:border-zinc-700 shadow-sm shadow-blue-500/10">
               <SymbolView name={{ ios: 'desktopcomputer', android: 'computer', web: 'computer' }} tintColor="#1a73e8" size={24} />
             </View>
             <Pressable onPress={notifyDesktop} className="bg-[#24c45c] hover:bg-[#1a9344] px-6 py-2.5 rounded-lg shadow-sm shadow-green-500/20">
               <Text className="text-white font-bold text-sm">Ativar notificações</Text>
             </Pressable>
           </View>
        </View>

        {/* Email Section */}
        <View className="py-8 border-b border-gray-100 dark:border-zinc-800/50 flex-col">
           <Text className="text-gray-800 dark:text-gray-200 font-bold text-[15px] mb-6">Por e-mail</Text>
           
           <Pressable onPress={() => setEmailEnabled(!emailEnabled)} className="flex-row items-center mb-6">
             <View className={`w-[22px] h-[22px] rounded items-center justify-center mr-3 border ${emailEnabled ? 'bg-[#24c45c] border-[#24c45c]' : 'bg-transparent border-gray-300 dark:border-zinc-700'}`}>
                {emailEnabled && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#fff" size={14} />}
             </View>
             <Text className="text-gray-600 dark:text-gray-400 font-medium text-[15px]">Quero receber alertas por e-mail toda:</Text>
           </Pressable>

           <View className="flex-row flex-wrap pl-8">
              {days.map(d => (
                <DayBadge key={d} day={d} active={activeDays.includes(d)} onPress={() => toggleDay(d)} />
              ))}
           </View>
        </View>

        {/* Mobile Section */}
        <View className="py-8">
           <Text className="text-gray-800 dark:text-gray-200 font-bold text-[15px] mb-2">Pelo celular</Text>
           <Text className="text-gray-500 dark:text-gray-400 text-sm">Configure os alertas recebidos pelo celular diretamente no seu aparelho</Text>
        </View>

      </View>
    </View>
  );
}
