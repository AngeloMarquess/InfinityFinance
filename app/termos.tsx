import { ScrollView, Text, View, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function TermosScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-zinc-950">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Back Button Overlay */}
      <View className="absolute top-12 left-6 z-10">
        <Pressable onPress={() => router.back()} className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-full items-center justify-center border border-gray-100 dark:border-zinc-800">
           <SymbolView name={{ ios: 'chevron.left', android: 'chevron-left', web: 'chevron-left' }} tintColor="#6b7280" size={20} />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header Section */}
        <View className="items-center mt-20 mb-8 pt-6">
          <View className="flex-row items-center mb-10">
            <SymbolView name={{ ios: 'circle.circle.fill', android: 'lens', web: 'lens' }} tintColor="#24c45c" size={32} />
            <Text className="text-gray-900 dark:text-white text-3xl font-bold ml-2 tracking-tight">infinity finance</Text>
          </View>
          
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Termos de Uso</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-lg">Sem contratos, sem compromisso</Text>
        </View>

        {/* Content Section */}
        <View className="px-6 md:px-20 max-w-4xl mx-auto w-full">
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4 uppercase">
            TERMOS E CONDIÇÕES GERAIS DE USO - INFINITYFINANCE
          </Text>

          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            Estes Termos e Condições Gerais de Uso (daqui em diante referidos apenas como "Termos") se aplicam à utilização da Plataforma "InfinityFinance", por você, "Usuário", através da contratação por assinatura de um dos nossos planos disponíveis no Site.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            A Plataforma “InfinityFinance”, de legítima e exclusiva propriedade da InfinityFinance Tecnologia Ltda. - CNPJ 00.000.000/0000-00, tem como objetivo servir como ferramenta para gestão financeira e responsabiliza você, Usuário, ao cumprimento destes Termos e Condições Gerais de Uso.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-6 leading-relaxed">
            Os Termos e Condições Gerais de Uso são inteiramente publicizados, desta forma, não será considerado que seja alegado desconhecimento das regras e obrigações aqui estabelecidas.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] font-bold mb-6 leading-relaxed">
            AO UTILIZAR A PLATAFORMA VOCÊ AUTOMATICAMENTE CONCORDA COM ESTES TERMOS E CONDIÇÕES GERAIS DE USO, QUE POSSUI NATUREZA JURÍDICA DE UM CONTRATO DE ADESÃO, RESPONSABILIZANDO-SE INTEGRALMENTE POR TODOS E QUAISQUER ATOS PRATICADOS. CASO VOCÊ NÃO CONCORDE COM QUALQUER DOS TERMOS E CONDIÇÕES ABAIXO ESTABELECIDOS, VOCÊ NÃO DEVE UTILIZAR A PLATAFORMA.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            Este documento poderá ser periodicamente alterado, conforme a necessidade, para que se mantenha atualizado. Manteremos a versão atualizada destes termos de uso no endereço https://infinityfinance.com.br/termos-de-uso e o mesmo pode ser consultado a qualquer momento, sendo que poderemos alterar este documento no site, somente visando aprimorar e melhorar os serviços prestados, no todo ou parcialmente, caso seja necessário, independente de prévio aviso. Para seu controle, você poderá ser notificado por uma mensagem via e-mail ou por outro meio de comunicação. Sempre mostramos a data da última versão no final deste documento. Ao continuar usando os serviços após as alterações, você estará concordando com os termos alterados. Se não concordar com as alterações, você deverá interromper o uso dos serviços e cancelá-los, seguindo as instruções do item "Cancelamentos e Reembolsos".
          </Text>

          {/* Divider */}
          <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 w-full mb-8" />

          {/* Item 1 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">1. DEFINIÇÕES IMPORTANTES:</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            1.1 Sistema/plataforma/aplicativo "InfinityFinance": programa de computador/software, composto por um conjunto de módulos específicos, desenvolvido e de propriedade intelectual legítima e exclusiva da InfinityFinance Tecnologia Ltda, sendo seu uso passível de disponibilização na forma de prestação de serviços (SaaS).
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            1.2 SaaS: Software as a Service: É o modelo de contratação (prestação de serviços) baseado na disponibilização do Sistema como serviço, utilizando infraestrutura/ambiente virtual oferecido pela InfinityFinance.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            1.3 Atualização das funções: é um dos itens que compõem a atualização do software, e se refere às funções do Sistema, ou seja, àquilo que o Sistema se propõe a atender, de acordo com as funcionalidades definidas pela InfinityFinance, independentemente de notificação prévia ao Usuário.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            1.4 Conteúdo: todo material, de propriedade intelectual exclusiva da InfinityFinance Tecnologia Ltda, eventualmente disponibilizado na plataforma.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            1.5 InfinityFinance Tecnologia Ltda ("InfinityFinance"): pessoa jurídica de direito privado detentora de todos os direitos de propriedade intelectual dos métodos e funcionalidades disponíveis dentro da Plataforma, podendo disponibilizar novos serviços, funcionalidades, conteúdo ou interromper o seu fornecimento, a qualquer tempo, sem a necessidade de prévia comunicação, não cabendo qualquer tipo de reclamação pelo Usuário.
          </Text>

          {/* Item 2 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">2. Conta InfinityFinance</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            2.1 O InfinityFinance é um produto pago, ao qual você poderá testar gratuitamente o Plano Manual por 7 dias.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            2.2 Para acessar os serviços, você deverá criar uma conta em uma de nossas plataformas (iOS, Android e Web), fornecendo um endereço de e-mail válido e de sua propriedade, para validação do cadastro.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            2.3 Oferecemos suporte técnico para os serviços, através do nossos canais de comunicação. Prioritariamente nosso suporte é realizado via e-mail.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            2.4 Enviaremos e-mails que tenham relação com os serviços utilizados. Caso você não queira recebê-los, poderá cancelar seu envio, clicando na opção ‘cancelar assinatura’ dentro do próprio e-mail enviado por nós. Você conseguirá utilizar os serviços de forma adequada e ágil se estiver usando: (i) Acesso a internet com velocidade maior que 1MB/s; (ii) Para a versão web. PC Windows ou Mac e últimas versões dos browsers: Mozilla Firefox, Google Chrome ou Safari; (iii) Para a versão mobile iOS. Será mantida a compatibilidade sempre da última versão e 2 anteriores; (iv) Para a versão mobile Android. Versão 4.1 ou superior;
          </Text>

          {/* Item 3 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">3. Sobre assinaturas</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.1 Depois de testar os 7 dias, é preciso contratar um dos planos disponíveis: Plano Manual, Plano Conectado ou Plano Conectado Plus. Os planos possuem diferentes funcionalidades e níveis de acesso. Por exemplo, funcionalidades como a Conexão Bancária estão disponíveis apenas nos planos Conectado e Conectado Plus. A InfinityFinance se reserva o direito de modificar as funcionalidades oferecidas em cada plano, sempre visando a melhoria dos serviços prestados.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.2 A assinatura do InfinityFinance se aplica exclusivamente à conta-perfil em que o usuário está logado no momento da contratação. Caso o usuário possua mais de uma conta-perfil vinculada ao mesmo e-mail, cada uma delas requer uma assinatura individual. Por exemplo, se um usuário possui uma conta-perfil para gastos pessoais e outra para as finanças da família, ambas as contas necessitarão de assinaturas separadas.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.3 As assinaturas são renovadas automaticamente ao término de cada ciclo de pagamento. Não tendo renovação da assinatura o usuário perderá o acesso aos recursos do sistema.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.4 Os valores das assinaturas, podem variar de acordo com sazonalidade, promoções e inclusive diferir por plataforma. O valor será apresentado sempre, de forma clara, na interface que o usuário está utilizando para efetuar sua aquisição.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.4.1 A InfinityFinance poderá, a seu exclusivo critério, oferecer benefícios promocionais como cupons, períodos adicionais de uso, upgrades temporários de plano ou acesso a funcionalidades específicas por tempo limitado. Tais benefícios serão informados de forma clara no momento de sua oferta e não configuram obrigação contratual futura.
          </Text>

          <Text className="text-[16px] font-bold text-gray-900 dark:text-white mt-4 mb-2">3.5 Teste gratuito (Free Trial):</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            Ao se cadastrar, o usuário concorda em realizar um teste gratuito do Plano Manual por 7 (sete) dias. Após a finalização do Teste Gratuito (Free Trial) o usuário deve efetivar a sua assinatura para continuar fazendo uso do InfinityFinance. Caso não efetue a assinatura, perderá o acesso à sua conta.
          </Text>

          <Text className="text-[16px] font-bold text-gray-900 dark:text-white mt-4 mb-2">3.6 Cancelamentos e reembolsos:</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            O valor pago será reembolsado integralmente, caso o usuário tenha solicitado o cancelamento em até 7 (sete) dias, a contar do início da utilização da licença. Caso o usuário tenha solicitado o cancelamento após esses 7 (sete) dias, o cancelamento da assinatura apenas cessará a cobrança no ciclo seguinte de pagamento, tendo o usuário ainda acesso ao InfinityFinance até o final do ciclo vigente e já pago.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.7 Nenhuma licença será reembolsada após os 7 (sete) dias de utilização do sistema.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.8 Cancelamentos Uso Android - Para cancelar a renovação automática, acesse as suas assinaturas no Google Play e faça o cancelamento do plano.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.9 Cancelamento Uso iOS - Para cancelar a renovação automática, siga estes passos no dispositivo Apple na aba Assinaturas e cancele a assinatura do InfinityFinance.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            3.10 Caso tenha qualquer dúvida sobre esse processo é só entrar em contato conosco no e-mail: oi@infinityfinance.com.br
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            3.11 Para cancelar sua assinatura, a qualquer momento, basta entrar em contato com nosso atendimento pelo e-mail: oi@infinityfinance.com.br.
          </Text>

          {/* Item 4 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">4. Nossa responsabilidade</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            4.1 A InfinityFinance se reserva o direito de auxiliar e cooperar com qualquer autoridade judicial ou órgão governamental, podendo enviar informações cadastrais do Usuário quando for obrigada por decisão judicial ou por força de determinação legal.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            4.2 A InfinityFinance não se responsabiliza por: a) Caso fortuito ou força maior; b) Inadimplência por parte dos Usuários; c) Ações de terceiros que afetem a estabilidade da Plataforma; d) Qualquer fraude, declaração fraudulenta ou violação do dever por parte de qualquer Usuário ou terceiro; e) Qualquer comentário realizado na Plataforma de maneira ofensiva ou ilícita por Usuários; f) Qualquer inexatidão nas informações inseridas por Usuários.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            4.3 A InfinityFinance adota todas as medidas técnicas e organizativas para segurança das informações. Nada obstante, nenhum sistema é absolutamente impenetrável, não sendo a InfinityFinance responsável por acessos não autorizados de ataques que não poderia razoavelmente impedir.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            4.4 Caso a InfinityFinance seja acionada judicialmente por atos atribuíveis aos Usuários, caberá a estes requerer a sua respectiva exclusão do polo passivo.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            4.5 Todas as comunicações que consistam em avisos na Plataforma serão consideradas como efetivamente recebidas.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            4.6 É de inteira responsabilidade do Usuário manter o ambiente de seu dispositivo seguro com antivírus e firewall.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            4.7 É possível que a Plataforma possa conter links para sites de terceiros. A InfinityFinance não é responsável pelo seu conteúdo.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            4.8 Não podemos nos responsabilizar por danos causados a você pela utilização de nossos serviços, uma vez que apenas disponibilizamos a ferramenta.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            4.9 Nossos serviços não garantem resultados específicos ou garantias de desempenho.
          </Text>

          {/* Item 5 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">5. Sua responsabilidade</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            5.1 O Usuário será o único responsável por seu login e senha e responderá por todos os atos praticados em sua conta.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            5.2 O Usuário compromete-se a comunicar a InfinityFinance imediatamente a respeito de qualquer uso não autorizado de sua conta.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            5.3 O conteúdo por você postado é de sua responsabilidade, assim como todos os atos por você praticados.
          </Text>

          {/* Item 6 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">6. Exclusões devido a inatividade</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            6.1 Serão excluídas do nosso banco de dados todas as contas sem assinaturas ativas que estiverem sem qualquer atividade por três meses.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            6.2 Entende-se por inatividade a falta de login em uma conta cadastrada.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            6.3 A InfinityFinance poderá excluir os vínculos de conexão bancária via Open Finance de usuários cuja licença esteja expirada há mais de 30 dias.
          </Text>

          {/* Item 7 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">7. Suspensão ou cancelamento do acesso devido a uso inadequado</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            7.1 A InfinityFinance poderá advertir, suspender, ou cancelar temporária ou definitivamente a conta de um Usuário em caso de: a. Suspeita de fraude; b. Impossibilidade de verificar identidade; c. Descumprimento de deveres; d. Qualquer ato que tenha causado algum dano; e. Violação de Termos; f. Não pagamento.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            7.2 Em qualquer hipótese de suspensão, não haverá direito à indenização.
          </Text>

          {/* Item 8 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">8. Alcance dos Serviços e Propriedade Intelectual</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            8.1 Estes Termos não geram nenhum contrato de sociedade ou congênere entre os Usuários e a InfinityFinance.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            8.2 Não há transmissão de propriedade intelectual.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            8.2.1 É vedado ao Usuário modificar, copiar, ou criar obras derivadas das informações coletadas na Plataforma.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            8.2.3 As funcionalidades disponibilizadas são protegidas pelas Leis de Propriedade de Softwares e Direitos Autorais aplicáveis no Brasil.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            8.2.5 O Conteúdo da Plataforma é protegido pela lei de direitos autorais, sendo proibido explorar e fazer engenharia reversa sem o consentimento prévio e expresso da InfinityFinance.
          </Text>

          {/* Item 9 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">9. Problemas decorrentes do uso da plataforma</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            9.1 A Plataforma é disponibilizada no estado técnico em que se encontra, não sendo garantida que seja livre de defeitos ou que atenderá às necessidades ininterruptas.
          </Text>

          {/* Item 10 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">10. Modificação dos termos de uso</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            10.1 Expressam o acordo total entre Usuários e a InfinityFinance.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            10.2 A InfinityFinance poderá fazer alterações nestes Termos, de forma comunicada pela Plataforma.
          </Text>

          {/* Item 11 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">11. Legislação e foro</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            11.1 Todos os itens são regidos pelas leis do Brasil e eleito Foro conforme a legislação competente da sede da empresa.
          </Text>

          {/* Item 12 */}
          <Text className="text-[17px] font-bold text-gray-900 dark:text-white mb-4">12. Fale conosco</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            12.1 Sempre que necessário, para tratar de qualquer tema envolvendo o uso da Plataforma, entre em contato através do nosso e-mail: oi@infinityfinance.com.br
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-4 leading-relaxed">
            12.2 Qualquer notificação será feita por e-mail ou dentro da própria Plataforma.
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-[15px] mb-8 leading-relaxed">
            12.3 Ao utilizar a Plataforma, o Usuário declara que leu e entendeu todas as informações aqui constantes.
          </Text>

          {/* Footer Texts */}
          <View className="items-center mt-6">
            <Text className="text-gray-500 dark:text-gray-400 text-[15px] font-medium mb-4 text-center">
              Obrigado por ler nossos Termos. Esperamos que você aproveite os nossos serviços!
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm mb-4">
              InfinityFinance, Última atualização em 06/2026.
            </Text>
            <Pressable>
              <Text className="text-brand-green font-bold mb-10">Políticas de Privacidade</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
