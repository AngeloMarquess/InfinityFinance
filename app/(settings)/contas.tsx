import { View, Text, Pressable, TextInput, ActivityIndicator, Modal, Platform, Alert } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function ContasScreen() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setAccounts(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar contas:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAccount() {
    if (!name.trim()) return;
    try {
      setIsSubmitting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não logado');

      const initialBalance = parseFloat(balance.replace(',', '.')) || 0;

      const { error } = await supabase
        .from('accounts')
        .insert({
          user_id: userData.user.id,
          name: name.trim(),
          balance: initialBalance,
          type: 'checking',
          color: '#24c45c'
        });

      if (error) throw error;

      setShowModal(false);
      setName('');
      setBalance('');
      fetchAccounts();

    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 max-w-5xl mx-auto w-full">
      <View className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm shadow-black/5 dark:shadow-none p-8 min-h-[500px] border border-gray-100 dark:border-zinc-800/50">
        
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Contas</Text>
          <Pressable onPress={() => setShowModal(true)} className="bg-[#dcfce7] dark:bg-[#0f291e] px-4 py-2 rounded-lg flex-row items-center hover:bg-[#bbf7d0] dark:hover:bg-[#153e2a] transition-colors">
            <SymbolView name={{ ios: 'plus.circle', android: 'add_circle', web: 'add_circle' }} tintColor="#24c45c" size={18} />
            <Text className="text-[#24c45c] font-medium ml-2">Nova conta</Text>
          </Pressable>
        </View>

        {/* Content */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#24c45c" />
          </View>
        ) : accounts.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 dark:text-gray-400 text-base font-medium">Adicione sua primeira Conta</Text>
          </View>
        ) : (
          <View className="gap-4">
            {accounts.map((acc, i) => (
              <View key={i} className="flex-row items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-[#24c45c]/10 items-center justify-center mr-4">
                    <SymbolView name={{ ios: 'building.columns', android: 'account_balance', web: 'account_balance' }} tintColor={acc.color || "#24c45c"} size={20} />
                  </View>
                  <View>
                    <Text className="text-gray-900 dark:text-white font-bold text-base">{acc.name}</Text>
                    {acc.institution && <Text className="text-gray-500 text-sm">{acc.institution}</Text>}
                  </View>
                </View>
                <Text className="text-gray-900 dark:text-white font-bold text-lg">
                  R$ {Number(acc.balance).toFixed(2).replace('.', ',')}
                </Text>
              </View>
            ))}
          </View>
        )}

      </View>

      {/* Insert Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center p-4">
          <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative">
            <Pressable onPress={() => setShowModal(false)} className="absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
              <Text className="text-gray-500 font-bold">X</Text>
            </Pressable>

            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6">Nova Conta</Text>

            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2">Nome da conta</Text>
              <View className="border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-[#24c45c] justify-center bg-white dark:bg-zinc-800">
                <TextInput 
                  className="w-full text-foreground outline-none text-gray-900 dark:text-white"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                  placeholder="Ex: Nubank, Itaú..."
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2">Saldo Inicial (R$)</Text>
              <View className="border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-[#24c45c] justify-center bg-white dark:bg-zinc-800">
                <TextInput 
                  className="w-full text-foreground outline-none text-gray-900 dark:text-white"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                  placeholder="0,00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={balance}
                  onChangeText={setBalance}
                />
              </View>
            </View>

            <Pressable 
              onPress={handleAddAccount}
              disabled={isSubmitting}
              className={`h-12 rounded-xl items-center justify-center mt-4 ${isSubmitting ? 'bg-[#24c45c]/50' : 'bg-[#24c45c] hover:bg-[#1a9344]'} transition-colors`}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Salvar Conta</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}
