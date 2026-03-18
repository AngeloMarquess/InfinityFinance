import { View, Text, Pressable, TextInput, ActivityIndicator, Modal, Platform, Alert, ScrollView } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const getIconMapping = (cat: any): any => {
  if (!cat.icon || cat.icon === 'tag') {
    const map: Record<string, any> = {
      'Alimentação': { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
      'Assinaturas e serviços': { ios: 'creditcard', android: 'credit_card', web: 'credit_card' },
      'Bares e restaurantes': { ios: 'wineglass', android: 'local_bar', web: 'local_bar' },
      'Casa': { ios: 'house', android: 'home', web: 'home' },
      'Compras': { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
      'Cuidados pessoais': { ios: 'person', android: 'person', web: 'person' },
      'Dívidas e empréstimos': { ios: 'doc.text', android: 'description', web: 'description' },
      'Educação': { ios: 'graduationcap', android: 'school', web: 'school' },
      'Família e filhos': { ios: 'figure.2.and.child.holdinghands', android: 'family_restroom', web: 'family_restroom' },
      'Impostos e Taxas': { ios: 'percent', android: 'percent', web: 'percent' },
      'Investimentos': { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
      'Lazer e hobbies': { ios: 'face.smiling', android: 'sentiment_satisfied', web: 'sentiment_satisfied' },
      'Mercado': { ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' },
      'Outros': { ios: 'list.bullet', android: 'list', web: 'list' },
      'Pets': { ios: 'pawprint', android: 'pets', web: 'pets' },
      'Presentes e doações': { ios: 'gift', android: 'card_giftcard', web: 'card_giftcard' },
      'Roupas': { ios: 'tshirt', android: 'checkroom', web: 'checkroom' },
      'Saúde': { ios: 'cross.case', android: 'medical_services', web: 'medical_services' },
      'Trabalho': { ios: 'briefcase', android: 'work', web: 'work' },
      'Transporte': { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
      'Viagem': { ios: 'airplane', android: 'flight', web: 'flight' }
    };
    return map[cat.name] || { ios: 'tag', android: 'label', web: 'label' };
  }
  return ICON_MAPPING[cat.icon] || { ios: cat.icon, android: 'label', web: 'label' };
};

const DEFAULT_EXPENSES = [
  { name: 'Alimentação', color: '#ec4899', iconName: 'fork.knife' },
  { name: 'Assinaturas e serviços', color: '#6366f1', iconName: 'creditcard' },
  { name: 'Bares e restaurantes', color: '#4f46e5', iconName: 'wineglass' },
  { name: 'Casa', color: '#3b82f6', iconName: 'house' },
  { name: 'Compras', color: '#e879f9', iconName: 'bag' },
  { name: 'Cuidados pessoais', color: '#f87171', iconName: 'person' },
  { name: 'Dívidas e empréstimos', color: '#fca5a5', iconName: 'doc.text' },
  { name: 'Educação', color: '#3730a3', iconName: 'graduationcap' },
  { name: 'Família e filhos', color: '#34d399', iconName: 'figure.2.and.child.holdinghands' },
  { name: 'Impostos e Taxas', color: '#fca5a5', iconName: 'percent' },
  { name: 'Investimentos', color: '#f472b6', iconName: 'chart.bar' },
  { name: 'Lazer e hobbies', color: '#10b981', iconName: 'face.smiling' },
  { name: 'Mercado', color: '#f97316', iconName: 'cart' },
  { name: 'Outros', color: '#9ca3af', iconName: 'list.bullet' },
  { name: 'Pets', color: '#f59e0b', iconName: 'pawprint' },
  { name: 'Presentes e doações', color: '#4338ca', iconName: 'gift' },
  { name: 'Roupas', color: '#14b8a6', iconName: 'tshirt' },
  { name: 'Saúde', color: '#3b82f6', iconName: 'cross.case' },
  { name: 'Trabalho', color: '#3730a3', iconName: 'briefcase' },
  { name: 'Transporte', color: '#60a5fa', iconName: 'bus' },
  { name: 'Viagem', color: '#fb7185', iconName: 'airplane' }
];

const AVAILABLE_ICONS = [
  'wineglass', 'tshirt', 'doc.text', 'graduationcap', 'face.smiling', 'airplane', 'building.columns', 'music.note',
  'basketball', 'umbrella', 'book.closed', 'briefcase', 'desktopcomputer', 'dice', 'trophy', 'eye', 'heart', 'flag', 
  'fork.knife', 'cart', 'dumbbell', 'cross.case', 'house', 'bolt', 'chart.bar', 'photo', 'lock', 'bicycle', 
  'list.bullet', 'pawprint', 'shield', 'star', 'tag', 'bus', 'bag'
];

const AVAILABLE_COLORS = [
  '#ec4899', '#8b5cf6', '#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', 
  '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', 
  '#f97316', '#ea580c', '#ef4444', '#f43f5e', '#9ca3af', '#6b7280'
];

const ICON_MAPPING: Record<string, any> = {
  wineglass: { ios: 'wineglass', android: 'local_bar', web: 'local_bar' },
  tshirt: { ios: 'tshirt', android: 'checkroom', web: 'checkroom' },
  'doc.text': { ios: 'doc.text', android: 'description', web: 'description' },
  graduationcap: { ios: 'graduationcap', android: 'school', web: 'school' },
  'face.smiling': { ios: 'face.smiling', android: 'sentiment_satisfied', web: 'sentiment_satisfied' },
  airplane: { ios: 'airplane', android: 'flight', web: 'flight' },
  'building.columns': { ios: 'building.columns', android: 'account_balance', web: 'account_balance' },
  'music.note': { ios: 'music.note', android: 'music_note', web: 'music_note' },
  basketball: { ios: 'basketball', android: 'sports_basketball', web: 'sports_basketball' },
  umbrella: { ios: 'umbrella', android: 'beach_access', web: 'beach_access' },
  'book.closed': { ios: 'book.closed', android: 'menu_book', web: 'menu_book' },
  briefcase: { ios: 'briefcase', android: 'work', web: 'work' },
  desktopcomputer: { ios: 'desktopcomputer', android: 'desktop_windows', web: 'desktop_windows' },
  dice: { ios: 'dice', android: 'casino', web: 'casino' },
  trophy: { ios: 'trophy', android: 'emoji_events', web: 'emoji_events' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  heart: { ios: 'heart', android: 'favorite', web: 'favorite' },
  flag: { ios: 'flag', android: 'flag', web: 'flag' },
  'fork.knife': { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  cart: { ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' },
  dumbbell: { ios: 'dumbbell', android: 'fitness_center', web: 'fitness_center' },
  'cross.case': { ios: 'cross.case', android: 'medical_services', web: 'medical_services' },
  house: { ios: 'house', android: 'home', web: 'home' },
  bolt: { ios: 'bolt', android: 'bolt', web: 'bolt' },
  'chart.bar': { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
  photo: { ios: 'photo', android: 'image', web: 'image' },
  lock: { ios: 'lock', android: 'lock', web: 'lock' },
  bicycle: { ios: 'bicycle', android: 'pedal_bike', web: 'pedal_bike' },
  'list.bullet': { ios: 'list.bullet', android: 'list', web: 'list' },
  pawprint: { ios: 'pawprint', android: 'pets', web: 'pets' },
  shield: { ios: 'shield', android: 'security', web: 'security' },
  star: { ios: 'star', android: 'star', web: 'star' },
  tag: { ios: 'tag', android: 'label', web: 'label' },
  bus: { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
  bag: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' }
};

export default function CategoriasScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  // Inline Subcategory Form
  const [inlineParentId, setInlineParentId] = useState<string | null>(null);
  const [inlineText, setInlineText] = useState('');
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);

  // Main Modal Form
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalType, setModalType] = useState('expense');
  const [modalIsSub, setModalIsSub] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('tag');
  const [selectedColor, setSelectedColor] = useState('#24c45c');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  
  // Accordions
  const [showIcons, setShowIcons] = useState(false);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('name', { ascending: true });
        
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSubCategoryInline(parentCat: any) {
    if (!inlineText.trim()) return;
    try {
      setIsInlineSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não logado');

      const { error } = await supabase.from('categories').insert({
        user_id: userData.user.id,
        parent_id: parentCat.id,
        name: inlineText.trim(),
        type: parentCat.type,
        color: parentCat.color,
        icon: parentCat.icon || 'tag'
      });

      if (error) throw error;
      setInlineParentId(null);
      setInlineText('');
      fetchCategories();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsInlineSubmitting(false);
    }
  }

  const openEditModal = (cat: any) => {
    setEditingCatId(cat.id);
    setModalName(cat.name);
    setModalType(cat.type);
    setSelectedColor(cat.color || '#24c45c');
    setSelectedIcon(cat.icon || 'tag');
    setModalIsSub(!!cat.parent_id);
    setShowModal(true);
  };

  const closeAndResetModal = () => {
    setShowModal(false);
    setEditingCatId(null);
    setModalName('');
    setSelectedIcon('tag');
    setSelectedColor('#24c45c');
    setModalIsSub(false);
    setModalType(activeTab);
  };

  async function handleArchiveCategory(id: string) {
    if (Platform.OS === 'web') {
      if (window.confirm("Tem certeza que deseja excluir esta categoria e todo o seu conteúdo?")) {
        try {
          setLoading(true);
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) throw error;
          fetchCategories();
        } catch (error: any) {
          window.alert('Erro: ' + error.message);
          setLoading(false);
        }
      }
      return;
    }

    Alert.alert(
      "Arquivar Categoria",
      "Tem certeza que deseja excluir esta categoria e todo o seu conteúdo?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Arquivar", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase.from('categories').delete().eq('id', id);
              if (error) throw error;
              fetchCategories();
            } catch (error: any) {
              Alert.alert('Erro', error.message);
              setLoading(false);
            }
          }
        }
      ]
    );
  }

  async function handleAddCategoryModal() {
    if (!modalName.trim()) return;
    try {
      setIsSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário logado inválido');

      if (editingCatId) {
        // Update existente
        const { error } = await supabase.from('categories')
          .update({
            name: modalName.trim(),
            color: selectedColor,
            icon: selectedIcon,
          })
          .eq('id', editingCatId);
        
        if (error) throw error;
      } else {
        // Insert nova
        const { error } = await supabase.from('categories').insert({
          user_id: userData.user.id,
          name: modalName.trim(),
          type: modalType,
          color: selectedColor,
          icon: selectedIcon,
        });

        if (error) throw error;
      }

      closeAndResetModal();
      fetchCategories();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function seedDefaultCategories() {
    try {
      setIsSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não logado');

      const inserts = DEFAULT_EXPENSES.map(cat => ({
        user_id: userData.user.id,
        name: cat.name,
        type: 'expense',
        color: cat.color,
        icon: cat.iconName
      }));

      inserts.push({
        user_id: userData.user.id,
        name: 'Salário',
        type: 'income',
        color: '#24c45c',
        icon: 'dollarsign.circle'
      });

      const { error } = await supabase.from('categories').insert(inserts);
      if (error) throw error;
      fetchCategories();
    } catch (error: any) {
      Alert.alert('Erro ao gerar padrão', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredCategories = categories.filter(c => c.type === activeTab);
  const parentCategories = filteredCategories.filter(c => !c.parent_id);

  return (
    <View className="flex-1 max-w-5xl mx-auto w-full">
      <View className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm shadow-black/5 dark:shadow-none p-8 min-h-[700px] border border-gray-100 dark:border-zinc-800/50">
        
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Categorias</Text>
          <Pressable 
            onPress={() => {
              setModalType(activeTab);
              setShowModal(true);
            }} 
            className="bg-[#dcfce7] dark:bg-[#0f291e] px-4 py-2 rounded-lg flex-row items-center hover:bg-[#bbf7d0] dark:hover:bg-[#153e2a] transition-colors"
          >
            <SymbolView name={{ ios: 'plus.circle', android: 'add_circle', web: 'add_circle' }} tintColor="#24c45c" size={18} />
            <Text className="text-[#24c45c] font-medium ml-2">Categoria de {activeTab === 'expense' ? 'despesa' : 'receita'}</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-gray-200 dark:border-zinc-800 mb-6 w-full max-w-xl">
          <Pressable onPress={() => setActiveTab('expense')} className={`flex-1 py-3 items-center border-b-[3px] ${activeTab === 'expense' ? 'border-[#24c45c]' : 'border-transparent'}`}>
            <Text className={`font-medium ${activeTab === 'expense' ? 'text-[#24c45c]' : 'text-gray-500'}`}>Despesas</Text>
          </Pressable>
          <Pressable onPress={() => setActiveTab('income')} className={`flex-1 py-3 items-center border-b-[3px] ${activeTab === 'income' ? 'border-[#24c45c]' : 'border-transparent'}`}>
            <Text className={`font-medium ${activeTab === 'income' ? 'text-[#24c45c]' : 'text-gray-500'}`}>Receitas</Text>
          </Pressable>
        </View>

        {/* Content */}
        {loading ? (
          <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#24c45c" /></View>
        ) : filteredCategories.length === 0 ? (
          <View className="flex-1 items-center justify-center pt-10">
            <Text className="text-gray-500 dark:text-gray-400 text-base font-medium mb-6">Você não possui categorias de {activeTab === 'expense' ? 'despesa' : 'receita'} cadastradas</Text>
            {activeTab === 'expense' && categories.length === 0 && (
              <Pressable onPress={seedDefaultCategories} disabled={isSubmitting} className="bg-[#24c45c] px-6 py-3 rounded-xl flex-row items-center hover:bg-[#1a9344] transition-colors">
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold ml-2">Gerar Categorias Padrão</Text>}
              </Pressable>
            )}
          </View>
        ) : (
          <ScrollView className="flex-1 -mx-8 px-8" showsVerticalScrollIndicator={false}>
            <View className="pb-8">
              {parentCategories.map((parent) => {
                const childs = filteredCategories.filter(c => c.parent_id === parent.id);
                const isFormOpen = inlineParentId === parent.id;
                
                return (
                  <View key={parent.id}>
                    {/* Parent Row */}
                    <View className="group flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 px-2 rounded-lg transition-colors">
                      <View className="flex-row items-center">
                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isFormOpen ? 'ring-2 ring-[#24c45c] ring-offset-2 dark:ring-offset-zinc-900 border-2 border-white dark:border-zinc-900' : ''}`} style={{ backgroundColor: parent.color || '#9ca3af' }}>
                          <SymbolView name={getIconMapping(parent)} tintColor="#ffffff" size={20} />
                        </View>
                        <Text className="text-gray-800 dark:text-gray-200 font-medium text-[15px]">{parent.name}</Text>
                      </View>
                      
                      <View className="flex-row items-center gap-x-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Pressable onPress={() => openEditModal(parent)} className="hover:opacity-60 transition-opacity bg-blue-600 rounded-md px-2 py-0.5"><Text className="text-white font-bold text-[12px]">editar</Text></Pressable>
                        <Pressable onPress={() => handleArchiveCategory(parent.id)} className="hover:opacity-60 transition-opacity"><Text className="text-blue-500 dark:text-blue-400 font-medium text-[13px]">arquivar</Text></Pressable>
                        <Pressable onPress={() => { setInlineParentId(parent.id); setInlineText(''); }} className="hover:opacity-60 transition-opacity"><Text className="text-blue-500 dark:text-blue-400 font-medium text-[13px]">+ sub-categoria</Text></Pressable>
                      </View>
                    </View>

                    {/* Children Rows */}
                    {childs.map((child) => (
                      <View key={child.id} className="group flex-row items-center justify-between py-3 border-b border-gray-100/50 dark:border-zinc-800/30 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 px-2 rounded-lg ml-12 transition-colors">
                        <View className="flex-row items-center">
                           <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: child.color || parent.color || '#9ca3af', opacity: 0.8 }}>
                             <SymbolView name={getIconMapping(child)} tintColor="#ffffff" size={16} />
                           </View>
                           <Text className="text-gray-600 dark:text-gray-300 font-medium text-[14px]">{child.name}</Text>
                        </View>
                        <View className="flex-row items-center gap-x-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                           <Pressable onPress={() => openEditModal(child)} className="hover:opacity-60 transition-opacity bg-blue-600 rounded-md px-2 py-0.5"><Text className="text-white font-bold text-[12px]">editar</Text></Pressable>
                           <Pressable onPress={() => handleArchiveCategory(child.id)} className="hover:opacity-60 transition-opacity"><Text className="text-blue-500 dark:text-blue-400 font-medium text-[13px]">arquivar</Text></Pressable>
                        </View>
                      </View>
                    ))}

                    {/* Inline Subcategory Form */}
                    {isFormOpen && (
                      <View className="ml-14 my-2 flex-row items-center">
                        <TextInput 
                           autoFocus
                           className="border border-[#24c45c] rounded-md px-3 h-9 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white min-w-[200px]"
                           style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                           placeholder="nome da sub-categoria"
                           placeholderTextColor="#9ca3af"
                           value={inlineText}
                           onChangeText={setInlineText}
                           onSubmitEditing={() => handleAddSubCategoryInline(parent)}
                        />
                        <Pressable onPress={() => handleAddSubCategoryInline(parent)} className="ml-4 bg-[#24c45c] rounded px-3 py-1.5 hover:bg-[#1a9344]">
                          {isInlineSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-white font-bold text-sm">adicionar</Text>}
                        </Pressable>
                        <Pressable onPress={() => setInlineParentId(null)} className="ml-3">
                          <Text className="text-red-500 font-medium text-sm">cancelar</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}

      </View>

      {/* Main Modal For New Category */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center p-4">
          <View className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <View className="p-8 pb-4 border-b border-transparent z-10">
              <Pressable onPress={closeAndResetModal} className="absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                <Text className="text-gray-400 font-bold">X</Text>
              </Pressable>
              <Text className="text-xl font-bold text-gray-800 dark:text-white">{editingCatId ? 'Editando categoria' : `Criando categoria de ${modalType === 'expense' ? 'despesa' : 'receita'}`}</Text>
              
              <View className="flex-row items-center mt-6">
                <Pressable onPress={() => setModalIsSub(false)} className="flex-row items-center mr-6">
                  <View className={`w-5 h-5 rounded-full border items-center justify-center ${!modalIsSub ? 'border-[#24c45c] bg-[#24c45c]' : 'border-gray-300 dark:border-zinc-600 bg-transparent'}`}>
                    {!modalIsSub && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#fff" size={12} />}
                  </View>
                  <Text className="ml-2 font-medium text-gray-700 dark:text-gray-300 text-sm">Categoria principal</Text>
                </Pressable>
                <Pressable onPress={() => setModalIsSub(true)} className="flex-row items-center">
                  <View className={`w-5 h-5 rounded-full border items-center justify-center ${modalIsSub ? 'border-[#24c45c] bg-[#24c45c]' : 'border-gray-300 dark:border-zinc-600 bg-transparent'}`}>
                    {modalIsSub && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#fff" size={12} />}
                  </View>
                  <Text className="ml-2 font-medium text-gray-700 dark:text-gray-300 text-sm">Subcategoria</Text>
                </Pressable>
              </View>
            </View>

            <ScrollView className="px-8" contentContainerStyle={{ paddingBottom: 32 }}>
              
              {/* Preview & Name Input Row */}
              <View className="flex-row items-center mt-4">
                <View className="w-20 h-20 rounded-full mr-6 items-center justify-center" style={{ backgroundColor: selectedColor }}>
                  <SymbolView name={ICON_MAPPING[selectedIcon] || { ios: 'tag', android: 'label', web: 'label' }} tintColor="#fff" size={32} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-medium text-sm mb-2">Nome da categoria</Text>
                  <View className="border border-gray-200 dark:border-zinc-700 rounded-lg h-12 px-4 focus-within:border-[#24c45c] bg-white dark:bg-zinc-800 justify-center">
                    <TextInput 
                      className="w-full outline-none text-gray-900 dark:text-white"
                      style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                      value={modalName}
                      onChangeText={setModalName}
                    />
                  </View>
                </View>
              </View>

              {/* Accordion Icons */}
              <View className="mt-8 border-b border-gray-100 dark:border-zinc-800 pb-6">
                <Pressable onPress={() => setShowIcons(!showIcons)} className="flex-row items-center justify-between mb-4">
                  <Text className="font-bold text-gray-500 text-sm">Escolha um ícone</Text>
                  <SymbolView name={{ ios: showIcons ? 'chevron.up' : 'chevron.down', android: showIcons ? 'expand_less' : 'expand_more', web: showIcons ? 'expand_less' : 'expand_more' }} tintColor="#9ca3af" size={20} />
                </Pressable>
                {showIcons && (
                  <View className="flex-row flex-wrap gap-3">
                    {AVAILABLE_ICONS.map((icon) => (
                      <Pressable 
                        key={icon} 
                        onPress={() => setSelectedIcon(icon)}
                        className={`w-10 h-10 rounded-full items-center justify-center ${selectedIcon === icon ? 'bg-gray-800' : 'bg-gray-100 dark:bg-zinc-800'}`}
                      >
                        <SymbolView name={ICON_MAPPING[icon] || { ios: 'tag', android: 'label', web: 'label' }} tintColor={selectedIcon === icon ? '#fff' : '#6b7280'} size={18} />
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Accordion Colors */}
              <View className="mt-6">
                <Pressable onPress={() => setShowColors(!showColors)} className="flex-row items-center justify-between mb-4">
                  <Text className="font-bold text-gray-500 text-sm">Escolha uma cor</Text>
                  <SymbolView name={{ ios: showColors ? 'chevron.up' : 'chevron.down', android: showColors ? 'expand_less' : 'expand_more', web: showColors ? 'expand_less' : 'expand_more' }} tintColor="#9ca3af" size={20} />
                </Pressable>
                {showColors && (
                  <View className="flex-row flex-wrap gap-3">
                    {AVAILABLE_COLORS.map((hex) => (
                      <Pressable 
                        key={hex} 
                        onPress={() => setSelectedColor(hex)}
                        className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
                        style={{ backgroundColor: hex }}
                      >
                        {selectedColor === hex && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#fff" size={16} />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View className="items-end mt-8">
                <Pressable 
                  onPress={handleAddCategoryModal}
                  disabled={!modalName || isSubmitting}
                  className={`px-6 py-3 rounded-xl items-center justify-center ${!modalName ? 'bg-gray-200 dark:bg-zinc-800' : 'bg-[#24c45c] hover:bg-[#1a9344]'} transition-colors`}
                >
                  {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className={`font-bold ${!modalName ? 'text-gray-400' : 'text-white'}`}>{editingCatId ? 'Atualizar categoria' : 'Criar categoria'}</Text>}
                </Pressable>
              </View>
            </ScrollView>

          </View>
        </View>
      </Modal>

    </View>
  );
}
