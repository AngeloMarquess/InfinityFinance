import { View, Text, Pressable, Platform, Alert, Modal, TextInput } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';

export default function TagsScreen() {
  const [showModal, setShowModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tags, setTags] = useState<{ id: string, name: string }[]>([]);

  const handleAddTag = () => {
    if (!tagName.trim()) return;
    setTags([...tags, { id: Math.random().toString(), name: tagName.trim() }]);
    setTagName('');
    setShowModal(false);
  };

  const removeTag = (id: string) => {
    // In production, this would delete from the database
    // "DELETE FROM tags WHERE id = ?"
    if (Platform.OS === 'web') {
      if (window.confirm("Deseja apagar esta tag?")) {
        setTags(tags.filter(t => t.id !== id));
      }
    } else {
      Alert.alert("Apagar Tag", "Deseja remover esta tag?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar", style: "destructive", onPress: () => setTags(tags.filter(t => t.id !== id)) }
      ]);
    }
  };

  return (
    <View className="flex-1 max-w-4xl mx-auto w-full">
      <View className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm shadow-black/5 dark:shadow-none p-8 min-h-[500px] border border-gray-100 dark:border-zinc-800/50">
        
        {/* Header */}
        <View className="flex-row items-center mb-16">
          <Text className="text-[22px] font-bold text-gray-900 dark:text-white mr-4">Tags</Text>
          <Pressable onPress={() => setShowModal(true)} className="w-8 h-8 rounded-full bg-[#24c45c] items-center justify-center hover:bg-[#1a9344] transition-colors shadow-sm shadow-green-500/20">
            <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor="#fff" size={18} />
          </Pressable>
        </View>

        {/* Content */}
        {tags.length === 0 ? (
          <View className="flex-1 items-center justify-center -mt-10">
            <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800 items-center justify-center mb-4">
              <Text className="text-white text-xl font-bold">!</Text>
            </View>
            <Text className="text-gray-500 dark:text-gray-400 font-medium">Você ainda não cadastrou nenhuma tag.</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {tags.map((tag) => (
              <View key={tag.id} className="flex-row items-center bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 px-4 py-2.5 rounded-full">
                <SymbolView name={{ ios: 'tag', android: 'local_offer', web: 'local_offer' }} tintColor="#9ca3af" size={14} />
                <Text className="text-gray-700 dark:text-gray-300 font-medium ml-2 mr-3">{tag.name}</Text>
                <Pressable onPress={() => removeTag(tag.id)} className="w-5 h-5 rounded-full bg-gray-200 dark:bg-zinc-700 items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} tintColor="#6b7280" size={10} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

      </View>

      {/* Insert Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center p-4">
          <View className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative">
            <Pressable onPress={() => { setShowModal(false); setTagName(''); }} className="absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <Text className="text-gray-500 font-bold">X</Text>
            </Pressable>

            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6">Nova Tag</Text>

            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2">Nome da tag</Text>
              <View className="border border-gray-200 dark:border-zinc-700 rounded-xl h-12 px-4 focus-within:border-[#24c45c] justify-center bg-white dark:bg-zinc-800">
                <TextInput 
                  className="w-full text-foreground outline-none text-gray-900 dark:text-white"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
                  placeholder="Ex: Viagem, Presente, Férias..."
                  placeholderTextColor="#9ca3af"
                  value={tagName}
                  onChangeText={setTagName}
                  autoFocus
                  onSubmitEditing={handleAddTag}
                />
              </View>
            </View>

            <Pressable 
              onPress={handleAddTag}
              disabled={!tagName.trim()}
              className={`h-12 rounded-xl items-center justify-center ${!tagName.trim() ? 'bg-gray-200 dark:bg-zinc-800' : 'bg-[#24c45c] hover:bg-[#1a9344]'} transition-colors`}
            >
              <Text className={`font-bold text-[15px] ${!tagName.trim() ? 'text-gray-400' : 'text-white'}`}>Salvar Tag</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}
