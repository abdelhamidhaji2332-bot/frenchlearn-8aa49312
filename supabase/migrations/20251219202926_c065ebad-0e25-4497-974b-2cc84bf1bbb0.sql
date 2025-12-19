-- Create teachers table
CREATE TABLE public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  bio text,
  avatar_url text,
  specialization text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on teachers
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Anyone can view teachers (public info)
CREATE POLICY "Anyone can view teachers" 
ON public.teachers 
FOR SELECT 
USING (true);

-- Only admins can manage teachers
CREATE POLICY "Admins can insert teachers" 
ON public.teachers 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update teachers" 
ON public.teachers 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete teachers" 
ON public.teachers 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create vocabulary table with comprehensive word entries
CREATE TABLE public.vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  french text NOT NULL,
  english text NOT NULL,
  arabic text,
  pronunciation text,
  category text NOT NULL,
  level text DEFAULT 'A1',
  audio_url text,
  image_url text,
  example_sentence text,
  example_translation text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on vocabulary
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;

-- Anyone can view vocabulary
CREATE POLICY "Anyone can view vocabulary" 
ON public.vocabulary 
FOR SELECT 
USING (true);

-- Only admins can manage vocabulary
CREATE POLICY "Admins can manage vocabulary" 
ON public.vocabulary 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create stories table for reading content
CREATE TABLE public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text,
  level text NOT NULL,
  content text NOT NULL,
  content_arabic text,
  audio_url text,
  image_url text,
  read_time_minutes integer DEFAULT 5,
  category text DEFAULT 'classic',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on stories
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Anyone can view stories
CREATE POLICY "Anyone can view stories" 
ON public.stories 
FOR SELECT 
USING (true);

-- Only admins can manage stories
CREATE POLICY "Admins can manage stories" 
ON public.stories 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert teacher Irify Belaid
INSERT INTO public.teachers (name, email, bio, specialization)
VALUES (
  'Irify Belaid',
  'irify.belaid@frenchmaster.com',
  'Expert French language teacher with over 10 years of experience teaching French to Arabic speakers. Specialized in conversational French and DELF/DALF exam preparation.',
  ARRAY['Conversation', 'Grammar', 'DELF Preparation', 'Business French']
);

-- Insert comprehensive vocabulary
INSERT INTO public.vocabulary (french, english, arabic, pronunciation, category, level, example_sentence, example_translation) VALUES
-- Greetings (A1)
('Bonjour', 'Hello / Good morning', 'صباح الخير / مرحبا', '/bɔ̃.ʒuʁ/', 'greetings', 'A1', 'Bonjour, comment allez-vous?', 'Hello, how are you?'),
('Bonsoir', 'Good evening', 'مساء الخير', '/bɔ̃.swaʁ/', 'greetings', 'A1', 'Bonsoir madame.', 'Good evening madam.'),
('Au revoir', 'Goodbye', 'مع السلامة', '/o.ʁə.vwaʁ/', 'greetings', 'A1', 'Au revoir, à demain!', 'Goodbye, see you tomorrow!'),
('Merci', 'Thank you', 'شكراً', '/mɛʁ.si/', 'greetings', 'A1', 'Merci beaucoup!', 'Thank you very much!'),
('S''il vous plaît', 'Please (formal)', 'من فضلك', '/sil.vu.plɛ/', 'greetings', 'A1', 'Un café, s''il vous plaît.', 'A coffee, please.'),
('Excusez-moi', 'Excuse me', 'عفواً', '/ɛk.sky.ze.mwa/', 'greetings', 'A1', 'Excusez-moi, où est la gare?', 'Excuse me, where is the station?'),
('Enchanté', 'Nice to meet you', 'تشرفت بمعرفتك', '/ɑ̃.ʃɑ̃.te/', 'greetings', 'A1', 'Enchanté de faire votre connaissance.', 'Nice to meet you.'),
('Comment ça va?', 'How are you?', 'كيف حالك؟', '/kɔ.mɑ̃.sa.va/', 'greetings', 'A1', 'Salut! Comment ça va?', 'Hi! How are you?'),

-- Numbers (A1)
('Un', 'One', 'واحد', '/œ̃/', 'numbers', 'A1', 'J''ai un frère.', 'I have one brother.'),
('Deux', 'Two', 'اثنان', '/dø/', 'numbers', 'A1', 'Il y a deux pommes.', 'There are two apples.'),
('Trois', 'Three', 'ثلاثة', '/tʁwa/', 'numbers', 'A1', 'Elle a trois enfants.', 'She has three children.'),
('Quatre', 'Four', 'أربعة', '/katʁ/', 'numbers', 'A1', 'La table a quatre pieds.', 'The table has four legs.'),
('Cinq', 'Five', 'خمسة', '/sɛ̃k/', 'numbers', 'A1', 'Cinq doigts sur la main.', 'Five fingers on the hand.'),
('Dix', 'Ten', 'عشرة', '/dis/', 'numbers', 'A1', 'Dix minutes à pied.', 'Ten minutes on foot.'),
('Vingt', 'Twenty', 'عشرون', '/vɛ̃/', 'numbers', 'A1', 'Elle a vingt ans.', 'She is twenty years old.'),
('Cent', 'One hundred', 'مئة', '/sɑ̃/', 'numbers', 'A2', 'Cent euros, s''il vous plaît.', 'One hundred euros, please.'),

-- Family (A1)
('La mère', 'Mother', 'الأم', '/la.mɛʁ/', 'family', 'A1', 'Ma mère cuisine bien.', 'My mother cooks well.'),
('Le père', 'Father', 'الأب', '/lə.pɛʁ/', 'family', 'A1', 'Mon père travaille ici.', 'My father works here.'),
('Le frère', 'Brother', 'الأخ', '/lə.fʁɛʁ/', 'family', 'A1', 'Mon frère est médecin.', 'My brother is a doctor.'),
('La sœur', 'Sister', 'الأخت', '/la.sœʁ/', 'family', 'A1', 'Ma sœur habite à Paris.', 'My sister lives in Paris.'),
('Les enfants', 'Children', 'الأطفال', '/le.zɑ̃.fɑ̃/', 'family', 'A1', 'Les enfants jouent dehors.', 'The children play outside.'),
('Les parents', 'Parents', 'الوالدين', '/le.pa.ʁɑ̃/', 'family', 'A1', 'Mes parents sont gentils.', 'My parents are kind.'),
('Le grand-père', 'Grandfather', 'الجد', '/lə.ɡʁɑ̃.pɛʁ/', 'family', 'A1', 'Mon grand-père a 80 ans.', 'My grandfather is 80 years old.'),
('La grand-mère', 'Grandmother', 'الجدة', '/la.ɡʁɑ̃.mɛʁ/', 'family', 'A1', 'Ma grand-mère fait des gâteaux.', 'My grandmother makes cakes.'),

-- Food (A1-A2)
('Le pain', 'Bread', 'الخبز', '/lə.pɛ̃/', 'food', 'A1', 'Je mange du pain.', 'I eat bread.'),
('Le fromage', 'Cheese', 'الجبن', '/lə.fʁɔ.maʒ/', 'food', 'A1', 'Le fromage français est délicieux.', 'French cheese is delicious.'),
('Le vin', 'Wine', 'النبيذ', '/lə.vɛ̃/', 'food', 'A2', 'Un verre de vin rouge.', 'A glass of red wine.'),
('L''eau', 'Water', 'الماء', '/lo/', 'food', 'A1', 'Je voudrais de l''eau.', 'I would like some water.'),
('Le café', 'Coffee', 'القهوة', '/lə.ka.fe/', 'food', 'A1', 'Un café, s''il vous plaît.', 'A coffee, please.'),
('La pomme', 'Apple', 'التفاحة', '/la.pɔm/', 'food', 'A1', 'Une pomme par jour.', 'An apple a day.'),
('Le croissant', 'Croissant', 'الكرواسون', '/lə.kʁwa.sɑ̃/', 'food', 'A1', 'Un croissant au beurre.', 'A butter croissant.'),
('La baguette', 'Baguette', 'الباغيت', '/la.ba.ɡɛt/', 'food', 'A1', 'Une baguette fraîche.', 'A fresh baguette.'),

-- Colors (A1)
('Rouge', 'Red', 'أحمر', '/ʁuʒ/', 'colors', 'A1', 'Le vin rouge.', 'Red wine.'),
('Bleu', 'Blue', 'أزرق', '/blø/', 'colors', 'A1', 'Le ciel est bleu.', 'The sky is blue.'),
('Vert', 'Green', 'أخضر', '/vɛʁ/', 'colors', 'A1', 'L''herbe est verte.', 'The grass is green.'),
('Jaune', 'Yellow', 'أصفر', '/ʒon/', 'colors', 'A1', 'Le soleil est jaune.', 'The sun is yellow.'),
('Noir', 'Black', 'أسود', '/nwaʁ/', 'colors', 'A1', 'Le chat noir.', 'The black cat.'),
('Blanc', 'White', 'أبيض', '/blɑ̃/', 'colors', 'A1', 'La neige est blanche.', 'The snow is white.'),

-- Travel (A2)
('L''aéroport', 'Airport', 'المطار', '/la.e.ʁɔ.pɔʁ/', 'travel', 'A2', 'Je vais à l''aéroport.', 'I''m going to the airport.'),
('Le train', 'Train', 'القطار', '/lə.tʁɛ̃/', 'travel', 'A1', 'Le train arrive à midi.', 'The train arrives at noon.'),
('L''hôtel', 'Hotel', 'الفندق', '/lo.tɛl/', 'travel', 'A2', 'Je réserve un hôtel.', 'I''m booking a hotel.'),
('Le billet', 'Ticket', 'التذكرة', '/lə.bi.jɛ/', 'travel', 'A2', 'Un billet aller-retour.', 'A round-trip ticket.'),
('La valise', 'Suitcase', 'الحقيبة', '/la.va.liz/', 'travel', 'A2', 'Ma valise est lourde.', 'My suitcase is heavy.'),
('Le passeport', 'Passport', 'جواز السفر', '/lə.pas.pɔʁ/', 'travel', 'A2', 'Voici mon passeport.', 'Here is my passport.');

-- Insert sample stories
INSERT INTO public.stories (title, author, level, content, content_arabic, read_time_minutes, category) VALUES
(
  'Le Petit Chaperon Rouge',
  'Charles Perrault',
  'A1',
  'Il était une fois une petite fille qui vivait dans un village. Sa mère lui dit un jour: "Va chez ta grand-mère et porte-lui ce gâteau."

La petite fille mit son chaperon rouge et partit dans la forêt. En chemin, elle rencontra un loup.

"Où vas-tu, petite fille?" demanda le loup.
"Je vais chez ma grand-mère," répondit-elle.

Le loup courut très vite et arriva le premier chez la grand-mère. Il entra dans la maison et attendit la petite fille.

Quand elle arriva, elle dit: "Grand-mère, comme vous avez de grandes dents!"
"C''est pour mieux te manger!" dit le loup.

Heureusement, un chasseur passait par là. Il entra dans la maison et sauva la petite fille et sa grand-mère.',
  'كان يا ما كان، كانت هناك فتاة صغيرة تعيش في قرية. قالت لها أمها ذات يوم: "اذهبي إلى جدتك واحملي لها هذه الكعكة."

ارتدت الفتاة الصغيرة قبعتها الحمراء وذهبت إلى الغابة. في الطريق، قابلت ذئباً.

"إلى أين تذهبين، أيتها الفتاة الصغيرة؟" سأل الذئب.
"أذهب إلى جدتي،" أجابت.

ركض الذئب بسرعة ووصل أولاً إلى منزل الجدة. دخل المنزل وانتظر الفتاة الصغيرة.

عندما وصلت، قالت: "جدتي، يا لأسنانك الكبيرة!"
"لأتمكن من أكلك أفضل!" قال الذئب.

لحسن الحظ، كان هناك صياد يمر من هناك. دخل المنزل وأنقذ الفتاة الصغيرة وجدتها.',
  6,
  'fairy_tale'
),
(
  'Le Café du Matin',
  'FrenchMaster',
  'A1',
  'Marie se réveille à sept heures. Elle va dans la cuisine. Elle prépare le café.

Le café sent bon. Marie prend une tasse. Elle ajoute du sucre et du lait.

Elle s''assied à table. Elle boit son café. Elle mange un croissant.

Par la fenêtre, elle regarde le soleil. C''est une belle journée. Marie est contente.

Elle finit son café et dit: "Maintenant, je suis prête pour la journée!"',
  'تستيقظ ماري في الساعة السابعة. تذهب إلى المطبخ. تحضر القهوة.

رائحة القهوة طيبة. تأخذ ماري كوباً. تضيف السكر والحليب.

تجلس على الطاولة. تشرب قهوتها. تأكل كرواسون.

من النافذة، تنظر إلى الشمس. إنه يوم جميل. ماري سعيدة.

تنهي قهوتها وتقول: "الآن، أنا جاهزة لليوم!"',
  3,
  'daily_life'
),
(
  'Au Restaurant',
  'FrenchMaster',
  'A2',
  'Pierre entre dans un restaurant. Le serveur arrive.

"Bonjour monsieur, bienvenue! Voulez-vous une table pour une personne?"
"Oui, s''il vous plaît," répond Pierre.

Le serveur donne le menu à Pierre. Pierre regarde le menu.

"Je voudrais le poulet avec des légumes, s''il vous plaît."
"Très bien. Et comme boisson?"
"Un verre de vin rouge, s''il vous plaît."

Le repas arrive. Le poulet est délicieux. Pierre mange tout.

"L''addition, s''il vous plaît," demande Pierre.
"Voici, monsieur. C''est vingt euros."
"Merci, voici trente euros. Gardez la monnaie."
"Merci beaucoup, monsieur! Bonne journée!"',
  'يدخل بيير إلى مطعم. يأتي النادل.

"مرحباً سيدي، أهلاً بك! هل تريد طاولة لشخص واحد؟"
"نعم، من فضلك،" يجيب بيير.

يعطي النادل القائمة لبيير. ينظر بيير إلى القائمة.

"أريد الدجاج مع الخضروات، من فضلك."
"حسناً. وللشرب؟"
"كأس من النبيذ الأحمر، من فضلك."

يصل الطعام. الدجاج لذيذ. يأكل بيير كل شيء.

"الحساب، من فضلك،" يطلب بيير.
"تفضل، سيدي. عشرون يورو."
"شكراً، هذه ثلاثون يورو. احتفظ بالباقي."
"شكراً جزيلاً، سيدي! يوم سعيد!"',
  5,
  'daily_life'
),
(
  'Le Voyage à Paris',
  'FrenchMaster',
  'B1',
  'Sophie et Marc planifient un voyage à Paris. Ils sont très excités.

"J''ai toujours rêvé de voir la Tour Eiffel!" dit Sophie.
"Et moi, je veux visiter le Louvre," répond Marc.

Ils arrivent à Paris en train. Le voyage dure deux heures. À la gare, ils prennent un taxi pour aller à leur hôtel.

Le premier jour, ils visitent Notre-Dame et marchent le long de la Seine. Le soir, ils dînent dans un petit bistrot.

"La cuisine française est incroyable," dit Sophie en mangeant son canard à l''orange.
"Je suis d''accord. Et ce vin est excellent," ajoute Marc.

Le deuxième jour, ils passent la journée au Louvre. Ils voient la Joconde et beaucoup d''autres œuvres d''art.

"Paris est vraiment la plus belle ville du monde," conclut Sophie.
"Absolument. Nous devons revenir bientôt," dit Marc en souriant.',
  'تخطط صوفي ومارك لرحلة إلى باريس. هما متحمسان جداً.

"لطالما حلمت برؤية برج إيفل!" تقول صوفي.
"وأنا أريد زيارة متحف اللوفر،" يجيب مارك.

يصلون إلى باريس بالقطار. تستغرق الرحلة ساعتين. في المحطة، يأخذون سيارة أجرة للذهاب إلى فندقهم.

في اليوم الأول، يزورون نوتردام ويمشون على طول نهر السين. في المساء، يتناولون العشاء في مقهى صغير.

"المطبخ الفرنسي مذهل،" تقول صوفي وهي تأكل البط بالبرتقال.
"أوافق. وهذا النبيذ ممتاز،" يضيف مارك.

في اليوم الثاني، يقضون اليوم في اللوفر. يرون الموناليزا والعديد من الأعمال الفنية الأخرى.

"باريس حقاً أجمل مدينة في العالم،" تختتم صوفي.
"بالتأكيد. يجب أن نعود قريباً،" يقول مارك وهو يبتسم.',
  10,
  'travel'
);

-- Update lessons table with more comprehensive content
INSERT INTO public.lessons (title, level, category, description, xp_reward, order_index, content) VALUES
-- Grammar Lessons
('Les Articles Définis', 'A1', 'grammar', 'Learn the definite articles: le, la, les', 15, 1, '{"theory": "Le (masculine), La (feminine), Les (plural). Use them before nouns.", "examples": ["le livre (the book)", "la table (the table)", "les enfants (the children)"], "exercises": [{"type": "fill_blank", "question": "___ chat est noir.", "answer": "Le"}]}'),
('Les Articles Indéfinis', 'A1', 'grammar', 'Learn the indefinite articles: un, une, des', 15, 2, '{"theory": "Un (masculine), Une (feminine), Des (plural). Use them for non-specific nouns.", "examples": ["un chien (a dog)", "une maison (a house)", "des fleurs (flowers)"], "exercises": [{"type": "fill_blank", "question": "J''ai ___ voiture.", "answer": "une"}]}'),
('Le Genre des Noms', 'A1', 'grammar', 'Understanding masculine and feminine nouns', 20, 3, '{"theory": "French nouns have gender. Learn patterns to identify them.", "examples": ["Words ending in -tion are feminine", "Words ending in -ment are masculine"], "exercises": []}'),
('Les Pronoms Personnels', 'A1', 'grammar', 'Personal pronouns: je, tu, il, elle, nous, vous, ils, elles', 20, 4, '{"theory": "Subject pronouns replace nouns as the subject of a sentence.", "examples": ["Je parle", "Tu parles", "Il/Elle parle"], "exercises": []}'),
('Le Présent de l''Indicatif', 'A1', 'grammar', 'Present tense conjugation for -er, -ir, -re verbs', 25, 5, '{"theory": "Regular verb conjugation patterns in present tense.", "examples": ["Parler: je parle, tu parles, il parle", "Finir: je finis, tu finis, il finit"], "exercises": []}'),
('Le Passé Composé', 'A2', 'grammar', 'Past tense with avoir and être', 30, 6, '{"theory": "Form: subject + avoir/être + past participle", "examples": ["J''ai mangé", "Je suis allé(e)"], "exercises": []}'),
('L''Imparfait', 'A2', 'grammar', 'Imperfect tense for past descriptions and habits', 30, 7, '{"theory": "Used for ongoing past actions and descriptions.", "examples": ["Quand j''étais jeune...", "Il faisait beau."], "exercises": []}'),
('Le Futur Simple', 'A2', 'grammar', 'Simple future tense', 25, 8, '{"theory": "Add endings to infinitive: -ai, -as, -a, -ons, -ez, -ont", "examples": ["Je parlerai", "Tu finiras"], "exercises": []}'),

-- Vocabulary Lessons
('Salutations et Politesse', 'A1', 'vocabulary', 'Greetings and polite expressions', 15, 1, '{"words": ["Bonjour", "Au revoir", "Merci", "S''il vous plaît"], "audio": true}'),
('La Famille', 'A1', 'vocabulary', 'Family members vocabulary', 15, 2, '{"words": ["père", "mère", "frère", "sœur", "enfant"], "audio": true}'),
('La Nourriture', 'A1', 'vocabulary', 'Food and drink vocabulary', 20, 3, '{"words": ["pain", "fromage", "vin", "eau", "café"], "audio": true}'),
('Les Couleurs', 'A1', 'vocabulary', 'Colors in French', 15, 4, '{"words": ["rouge", "bleu", "vert", "jaune", "noir", "blanc"], "audio": true}'),
('Les Nombres', 'A1', 'vocabulary', 'Numbers 1-100', 20, 5, '{"words": ["un", "deux", "trois", "dix", "vingt", "cent"], "audio": true}'),
('Les Voyages', 'A2', 'vocabulary', 'Travel-related vocabulary', 25, 6, '{"words": ["aéroport", "train", "hôtel", "billet", "valise"], "audio": true}'),
('Au Restaurant', 'A2', 'vocabulary', 'Restaurant and dining vocabulary', 25, 7, '{"words": ["menu", "commande", "addition", "pourboire", "serveur"], "audio": true}'),

-- Speaking Lessons
('Se Présenter', 'A1', 'speaking', 'Introduce yourself in French', 20, 1, '{"phrases": ["Je m''appelle...", "J''ai ... ans", "Je viens de..."], "dialogues": []}'),
('Au Café', 'A1', 'speaking', 'Ordering at a café', 20, 2, '{"phrases": ["Un café, s''il vous plaît", "L''addition, s''il vous plaît"], "dialogues": []}'),
('Demander son Chemin', 'A2', 'speaking', 'Asking for directions', 25, 3, '{"phrases": ["Où est...?", "Tournez à gauche/droite", "C''est loin?"], "dialogues": []}');