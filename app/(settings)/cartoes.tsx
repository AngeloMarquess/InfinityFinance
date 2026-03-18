import { View, Text, Pressable, TextInput, ActivityIndicator, Modal, Platform, Alert } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function CartoesScreen() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setCards(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar cartões:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCard() {
    if (!name.trim()) return;
    try {
      setIsSubmitting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não logado');

      const creditLimit = parseFloat(limit.replace(',', '.')) || 0;

      const { error } = await supabase
        .from('cards')
        .insert({
          user_id: userData.user.id,
          name: name.trim(),
          credit_limit: creditLimit,
          closing_day: 1,
          due_day: 5
        });

      if (error) throw error;

      setShowFormModal(false);
      setName('');
      setLimit('');
      fetchCards();

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
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Cartões de Crédito</Text>
          <Pressable onPress={() => setShowSelectionModal(true)} className="bg-[#dcfce7] dark:bg-[#0f291e] px-4 py-2 rounded-lg flex-row items-center hover:bg-[#bbf7d0] dark:hover:bg-[#153e2a] transition-colors">
            <SymbolView name={{ ios: 'plus.circle', android: 'add_circle', web: 'add_circle' }} tintColor="#24c45c" size={18} />
            <Text className="text-[#24c45c] font-medium ml-2">Adicionar cartão</Text>
          </Pressable>
        </View>

        {/* Content */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#24c45c" />
          </View>
        ) : cards.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 dark:text-gray-400 text-base font-medium">Adicione seu primeiro Cartão de Crédito</Text>
          </View>
        ) : (
          <View className="gap-4">
            {cards.map((card, i) => (
              <View key={i} className="flex-row items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-md bg-gray-800 items-center justify-center mr-4">
                    <SymbolView name={{ ios: 'creditcard', android: 'credit_card', web: 'credit_card' }} tintColor="#fff" size={20} />
                  </View>
                  <View>
                    <Text className="text-gray-900 dark:text-white font-bold text-base">{card.name}</Text>
                    <Text className="text-gray-500 text-sm">Limite: R$ {Number(card.credit_limit).toFixed(2).replace('.', ',')}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

      </View>

      {/* Selection Modal (Open Finance vs Manual) */}
      <Modal visible={showSelectionModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center p-4">
          <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
            <Pressable onPress={() => setShowSelectionModal(false)} className="absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
              <Text className="text-gray-500 font-bold">X</Text>
            </Pressable>

            <View className="mt-4 mb-4">
              <Pressable 
                onPress={() => { setShowSelectionModal(false); setShowFormModal(true); }}
                className="border border-gray-200 dark:border-zinc-700 rounded-xl p-6 mb-4 hover:border-[#24c45c] transition-colors bg-white dark:bg-zinc-800"
              >
                <Text className="font-bold text-gray-900 dark:text-white text-[17px] mb-2">Criar cartão manual</Text>
                <Text className="text-gray-500 text-sm leading-relaxed">Adicione um Cartão de crédito para controlar gastos incluindo manualmente.</Text>
              </Pressable>

              <Pressable 
                onPress={() => { 
                  if (Platform.OS === 'web') {
                    window.alert('Em Breve 🚀\nNossa integração inteligente via Open Finance com as maiores instituições estará disponível nas próximas atualizações!');
                  } else {
                    Alert.alert('Em Breve 🚀', 'Nossa integração inteligente via Open Finance com as maiores instituições estará disponível nas próximas atualizações!');
                  }
                }}
                className="border border-gray-200 dark:border-zinc-700 rounded-xl p-6 hover:border-[#24c45c] transition-colors bg-white dark:bg-zinc-800"
              >
                <View className="flex-row items-center mb-2">
                  <Text className="font-bold text-gray-900 dark:text-white text-[17px]">Criar cartão conectado</Text>
                  <View className="bg-[#24c45c] rounded-full p-1 ml-3">
                    <SymbolView name={{ ios: 'link', android: 'link', web: 'link' }} tintColor="#fff" size={12} />
                  </View>
                </View>
                <Text className="text-gray-500 text-sm leading-relaxed">Conecte com a sua Instituição Financeira via Open Finance e receba todos gastos do cartão automaticamente.</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      {/* Insert Modal */}
      <Modal visible={showFormModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center p-4">
          <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative">
            <Pressable onPress={() => { setShowFormModal(false); setName(''); setLimit(''); }} className="absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
              <Text className="text-gray-500 font-bold">X</Text>
            </Pressable>

            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6">Novo Cartão</Text>

            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2">Nome do cartão</Text>
              <View className="border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-[#24c45c] justify-center bg-white dark:bg-zinc-800">
                <TextInput 
                  className="w-full text-foreground outline-none text-gray-900 dark:text-white"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                  placeholder="Ex: Nubank, Azul Itaucard..."
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2">Limite Total (R$)</Text>
              <View className="border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-[#24c45c] justify-center bg-white dark:bg-zinc-800">
                <TextInput 
                  className="w-full text-foreground outline-none text-gray-900 dark:text-white"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                  placeholder="0,00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={limit}
                  onChangeText={setLimit}
                />
              </View>
            </View>

            <Pressable 
              onPress={handleAddCard}
              disabled={isSubmitting}
              className={`h-12 rounded-xl items-center justify-center mt-4 ${isSubmitting ? 'bg-[#24c45c]/50' : 'bg-[#24c45c] hover:bg-[#1a9344]'} transition-colors`}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Salvar Cartão</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}
