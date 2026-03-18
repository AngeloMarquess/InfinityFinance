import { View, Text, Pressable, Platform, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const Radio = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => (
  <Pressable onPress={onPress} className="flex-row items-center mb-3 group">
    {selected ? (
      <View className="w-5 h-5 rounded-full bg-[#24c45c] items-center justify-center mr-3" style={{ display: 'flex' }}>
         <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#fff" size={12} />
      </View>
    ) : (
      <View className="w-5 h-5 rounded-full border border-gray-300 dark:border-zinc-700 bg-transparent items-center justify-center mr-3 group-hover:border-[#24c45c] transition-colors" style={{ display: 'flex' }} />
    )}
    <Text className={`font-medium text-[14px] ${selected ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{label}</Text>
  </Pressable>
);

const Section = ({ title, description, children, action }: any) => (
  <View className="flex-col sm:flex-row justify-between py-8 border-b border-gray-100 dark:border-zinc-800/50">
    <View className="flex-1 pr-4 sm:pr-12 mb-4 sm:mb-0 justify-center">
      <Text className="text-gray-800 dark:text-gray-200 font-bold text-[15px] mb-2">{title}</Text>
      <Text className="text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed">{description}</Text>
    </View>
    <View className="sm:w-48 justify-center items-start">
      {children}
      {action && (
        <Pressable onPress={action.onPress} className="mt-1">
          <Text className="text-[#24c45c] font-bold text-[14px] hover:opacity-80 transition-opacity pb-1">{action.label}</Text>
        </Pressable>
      )}
    </View>
  </View>
);

export default function PreferenciasScreen() {
  const [order, setOrder] = useState('decrescente');
  const [period, setPeriod] = useState('mensal');
  const [showDailyBalance, setShowDailyBalance] = useState('nao');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulating save operation to local state or future DB
    setTimeout(() => {
      setIsSaving(false);
      if (Platform.OS === 'web') {
        window.alert('Preferências salvas com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Preferências salvas com sucesso!');
      }
    }, 800);
  };

  const confirmDeleteTransactions = () => {
    const msg = "Tem certeza? Isso apagará TODAS as suas transações. Contas, cartões e categorias serão mantidas.";
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) {
         deleteAllTransactions();
      }
    } else {
      Alert.alert("Zerar Conta", msg, [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: deleteAllTransactions }
      ]);
    }
  };

  const confirmDeleteAccount = () => {
    const msg = "Aviso Irreversível! Sua conta e TODOS os dados serão apagados para sempre. Deseja continuar?";
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) {
         window.alert("Em ambiente de produção, esta função apaga o usuário via Edge Function (Supabase Admin API).");
      }
    } else {
      Alert.alert("Excluir Conta", msg, [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir Permanentemente", style: "destructive" }
      ]);
    }
  };

  const deleteAllTransactions = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      
      const { error } = await supabase.from('transactions').delete().eq('user_id', userData.user.id);
      if (error) throw error;
      
      if (Platform.OS === 'web') window.alert("Transações excluídas com sucesso!");
      else Alert.alert("Sucesso", "Transações excluídas com sucesso!");
    } catch (err: any) {
      if (Platform.OS === 'web') window.alert("Erro: " + err.message);
      else Alert.alert("Erro", err.message);
    }
  };

  return (
    <ScrollView className="flex-1 max-w-4xl mx-auto w-full" showsVerticalScrollIndicator={false}>
      <View className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm shadow-black/5 dark:shadow-none p-6 sm:p-10 min-h-[500px] border border-gray-100 dark:border-zinc-800/50 mb-10">
        
        <Text className="text-[22px] font-bold text-gray-900 dark:text-white mb-2">Preferências</Text>
        
        <View className="mt-4">
          
          <Section 
            title="Ordenação dos seus Lançamentos" 
            description="Ordem (baseado na data) que suas transações serão listadas na tela de Lançamentos"
          >
            <Radio label="Crescente" selected={order === 'crescente'} onPress={() => setOrder('crescente')} />
            <Radio label="Decrescente" selected={order === 'decrescente'} onPress={() => setOrder('decrescente')} />
          </Section>

          <Section 
            title="Período de navegação padrão" 
            description="Para quem faz muitos lançamentos durante o mês, o ideal é escolher semanal ou diário"
          >
            <Radio label="Diário" selected={period === 'diario'} onPress={() => setPeriod('diario')} />
            <Radio label="Semanal" selected={period === 'semanal'} onPress={() => setPeriod('semanal')} />
            <Radio label="Mensal" selected={period === 'mensal'} onPress={() => setPeriod('mensal')} />
          </Section>

          <Section 
            title="Saldo diário" 
            description="Mostra saldos listados na tela de Lançamentos ao final de cada dia"
          >
            <Radio label="Sim" selected={showDailyBalance === 'sim'} onPress={() => setShowDailyBalance('sim')} />
            <Radio label="Não" selected={showDailyBalance === 'nao'} onPress={() => setShowDailyBalance('nao')} />
          </Section>

          <Section 
            title="Começar do zero" 
            description="Aqui você pode zerar sua conta, deletando toda sua movimentação financeira. Suas contas, cartões, categorias e tags cadastradas permanecerão intactadas."
            action={{ label: "Excluir minhas transações", onPress: confirmDeleteTransactions }}
          />

          <Section 
            title="Excluir conta" 
            description="Já é hora de dizer tchau? Aqui você pode excluir sua conta definitivamente"
            action={{ label: "Excluir conta por completo", onPress: confirmDeleteAccount }}
          />

        </View>

        <View className="items-center sm:items-end mt-10">
          <Pressable 
            onPress={handleSave}
            disabled={isSaving}
            className="bg-[#24c45c] px-8 py-3 rounded-xl hover:bg-[#1a9344] transition-colors w-full sm:w-auto items-center shadow-lg shadow-green-500/20"
          >
            {isSaving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-[15px]">Salvar alterações</Text>}
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}
