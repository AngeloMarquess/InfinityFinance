import { View, Text, ScrollView, Pressable, Switch, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';

const PlanCard = ({ 
  title, 
  badge,
  description, 
  priceMonthly, 
  priceTotal, 
  isPopular, 
  features, 
  featuresExpanded, 
  onToggleFeatures,
}: any) => {
  return (
    <View className={`bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-10 mb-6 border-2 relative shadow-sm ${isPopular ? 'border-[#24c45c] shadow-[#24c45c]/10 z-10' : 'border-gray-200 dark:border-zinc-800'}`}>
      
      {badge && (
        <View className="absolute -top-3.5 left-6 bg-[#fcd34d] px-3 py-1 rounded-md">
          <Text className="text-yellow-900 font-bold text-xs">{badge}</Text>
        </View>
      )}

      <View className="flex-col md:flex-row justify-between">
        
        {/* Left Info */}
        <View className="flex-1 pr-4 mb-6 md:mb-0">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-sm mb-6">{description}</Text>
          
          <Pressable onPress={onToggleFeatures} className="flex-row items-center hover:opacity-70 transition-opacity">
             <Text className="text-gray-900 dark:text-gray-300 font-bold text-sm mr-2">{featuresExpanded ? 'Ocultar recursos' : 'Ver recursos'}</Text>
             <SymbolView name={{ ios: featuresExpanded ? 'chevron.up' : 'chevron.down', android: featuresExpanded ? 'expand_less' : 'expand_more', web: featuresExpanded ? 'expand_less' : 'expand_more' }} tintColor="#24c45c" size={16} />
          </Pressable>
        </View>

        {/* Right Pricing */}
        <View className="items-start md:items-end justify-start min-w-[220px]">
          <Text className="text-gray-900 dark:text-white font-bold text-[15px]">12x de</Text>
          <View className="flex-row items-baseline mb-1">
             <Text className="text-gray-900 dark:text-white font-black text-4xl sm:text-[42px] mt-1 tracking-tight">R$ {priceMonthly}</Text>
             <Text className="text-gray-900 dark:text-white font-bold text-lg ml-1">/mês</Text>
          </View>
          <View className="flex-row items-center mb-8">
             <Text className="text-gray-500 dark:text-gray-400 text-sm">ou R${priceTotal} à vista</Text>
             <View className="border border-gray-300 dark:border-zinc-700 rounded-full px-2 py-0.5 ml-2">
               <Text className="text-gray-500 dark:text-gray-400 text-[11px] font-bold">15% OFF</Text>
             </View>
          </View>

          <Pressable className={`w-full py-3.5 rounded-lg flex-row items-center justify-center transition-colors ${isPopular ? 'bg-[#24c45c] hover:bg-[#1a9344]' : 'bg-transparent border border-[#24c45c] hover:bg-[#24c45c]/10'}`}>
             <Text className={`font-bold text-[15px] ${isPopular ? 'text-white' : 'text-[#24c45c]'}`}>Escolher este plano</Text>
          </Pressable>
        </View>

      </View>

      {/* Expanded Features */}
      {featuresExpanded && (
        <View className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800 flex-row flex-wrap">
          {features.map((feat: any, idx: number) => (
            <View key={idx} className="w-full sm:w-1/2 flex-row items-start mb-5 pr-4">
              {feat.negative ? (
                <View className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-3 mt-0.5" style={{ display: 'flex' }}>
                  <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} tintColor="#ef4444" size={10} />
                </View>
              ) : (
                <View className="w-5 h-5 rounded-full bg-gray-200 dark:bg-zinc-700 items-center justify-center mr-3 mt-0.5" style={{ display: 'flex' }}>
                  <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor="#6b7280" size={10} />
                </View>
              )}
              <Text className="text-gray-600 dark:text-gray-300 text-sm flex-1 leading-relaxed">
                {feat.highlight ? <Text className="font-bold">{feat.highlight} </Text> : null}
                {feat.text}
              </Text>
            </View>
          ))}
        </View>
      )}

    </View>
  );
};

export default function PlanoScreen() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({ 0: false, 1: true, 2: false });

  const toggleExpand = (index: number) => {
    setExpandedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const PLANS = [
    {
      title: "Plano Manual",
      description: "Para quem gosta de acompanhar cada detalhe e lançar manualmente seus lançamentos.",
      priceMonthly: isAnnual ? "19,90" : "24,90",
      priceTotal: isAnnual ? "199,90" : "298,80",
      isPopular: false,
      features: [
        { text: "Sem Conexão Bancária", negative: true },
        { text: "Controle manual de contas e cartões" },
        { text: "Criação de categorias e subcategorias" },
        { text: "Limite de gastos ilimitados" },
        { text: "Alerta de contas a pagar" },
        { text: "Relatórios completos e fáceis de entender" },
      ]
    },
    {
      title: "Plano Conectado",
      badge: "Mais popular",
      description: "Ideal para quem quer agilidade ao organizar suas finanças e tem poucas contas e cartões.",
      priceMonthly: isAnnual ? "39,90" : "49,90",
      priceTotal: isAnnual ? "399,90" : "598,80",
      isPopular: true,
      features: [
        { highlight: "Tudo do Plano Manual" },
        { highlight: "Até 3", text: "contas/cartões conectados" },
        { text: "Importe várias transações com 1 clique" },
        { highlight: "1 atualização automática", text: "de transações por dia" },
        { highlight: "2 atualizações extras", text: "de transações por dia" },
        { text: "Conexão com contas Pessoa Física" },
      ]
    },
    {
      title: "Plano Conectado Plus",
      description: "Feito para quem precisa gerenciar mais de 3 contas e cartões de forma automática.",
      priceMonthly: isAnnual ? "59,90" : "69,90",
      priceTotal: isAnnual ? "599,90" : "838,80",
      isPopular: false,
      features: [
        { highlight: "Tudo do Plano Manual" },
        { highlight: "Até 10", text: "contas/cartões conectados" },
        { text: "Conexão com contas Pessoa Física e Pessoa Jurídica" },
        { highlight: "Tudo do Plano Conectado" },
        { highlight: "4 atualizações extras", text: "de transações por dia" },
      ]
    }
  ];

  return (
    <ScrollView className="flex-1 w-full bg-[#f0fdf4] dark:bg-[#0f1d16] rounded-xl relative" showsVerticalScrollIndicator={false}>
      
      {/* Hero Section Container */}
      <View className="py-16 px-6 items-center flex-col max-w-4xl mx-auto w-full">
        
        {/* Magic Circles Decoration */}
        <View className="relative w-32 h-32 items-center justify-center mb-6">
           <View className="w-16 h-16 rounded-full border-[6px] border-[#24c45c] items-center justify-center" />
           <View className="w-8 h-8 rounded-full bg-blue-600 absolute bottom-4 left-0 items-center justify-center">
             <SymbolView name={{ ios: 'star.fill', android: 'star', web: 'star' }} tintColor="#fff" size={14} />
           </View>
           <View className="w-8 h-8 rounded-full bg-[#24c45c] absolute bottom-2 right-0 items-center justify-center">
             <SymbolView name={{ ios: 'link', android: 'link', web: 'link' }} tintColor="#fff" size={14} />
           </View>
           <View className="w-8 h-8 rounded-full bg-orange-400 absolute top-0 right-4 items-center justify-center">
             <SymbolView name={{ ios: 'cube', android: 'inventory_2', web: 'inventory_2' }} tintColor="#fff" size={14} />
           </View>
        </View>

        <Text className="text-[26px] sm:text-[34px] font-bold text-gray-900 dark:text-white text-center mb-8 max-w-2xl leading-tight">
          Confira nossos planos e escolha a melhor forma de cuidar do seu dinheiro.
        </Text>

        <View className="flex-row items-center justify-center mb-10">
          <Text className={`font-medium mr-4 ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Mensal</Text>
          <Switch 
            value={isAnnual} 
            onValueChange={setIsAnnual} 
            trackColor={{ false: '#d1d5db', true: '#24c45c' }}
            thumbColor="#ffffff"
            // Required for web to look smooth
            style={Platform.OS === 'web' ? { transform: [{ scale: 1.2 }] } : {}}
          />
          <Text className={`font-medium ml-4 ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Anual</Text>
        </View>

        {/* Cards Wrapper */}
        <View className="w-full">
          {PLANS.map((plan, i) => (
            <PlanCard 
              key={i} 
              {...plan} 
              isAnnual={isAnnual}
              featuresExpanded={expandedCards[i]}
              onToggleFeatures={() => toggleExpand(i)}
            />
          ))}
        </View>
        
      </View>
      
    </ScrollView>
  );
}
