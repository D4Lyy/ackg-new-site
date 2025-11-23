import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "ku";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.activities": "Activités",
    "nav.courses": "Cours de langues",
    "nav.about": "À propos",
    
    // Home
    "home.title": "ASSOCIATION CULTURELLE KURDE DE GENÈVE",
    "home.subtitle": "Pour diffuser la culture kurde en Suisse",
    "home.mission.title": "Notre mission",
    "home.mission.culture.title": "Préservation de la culture",
    "home.mission.culture.desc": "Notre but est la préservation, la défense et le développement des valeurs kurdes ainsi que l'intégration des kurdes dans la société helvétique",
    "home.mission.language.title": "Apprentissage de la langue",
    "home.mission.language.desc": "Nous proposons des cours de langues pour tous les kurdes vivant en Suisse. Les cours sont enseignés par des enseignants kurdes expérimentés",
    "home.mission.activities.title": "Activités pour tous",
    "home.mission.activities.desc": "Organisation d'événements culturels et sociaux afin de favoriser les liens entre Kurdes installés en Suisse",
    "home.courses.title": "Cours de langue Kurde",
    "home.courses.desc": "Les enseignants utilisés de notre communauté kurde à Genève ont à cœur de transmettre la richesse de notre langue et de notre culture. Cours adaptés aux enfants, à partir de 5 ans qui bénéficient d'un apprentissage adapté, ludique et stimulant. Cours pour adultes également disponibles.",
    "home.courses.button": "En savoir plus",
    "home.support.title": "Soutenir la diffusion de la culture kurde",
    "home.support.desc": "Votre soutien nous aide à continuer notre mission de préservation et de diffusion de la culture kurde en Suisse. Chaque contribution fait la différence.",
    "home.support.button": "Faire un don",
    "home.princess.title": "Visite à la princesse kurde",
    "home.princess.desc": "Nous avons eu l'honneur de recevoir la visite de la princesse kurde lors de notre événement culturel annuel. Une rencontre mémorable qui témoigne de l'importance de notre patrimoine et de nos traditions.",
    "home.princess.button": "Découvrir l'événement",
    "home.activities.title": "Nos Activités",
    "home.activities.viewAll": "Voir toutes",
    "home.activities.desc": "Nous organisons de nombreuses activités, ouvertes à tous!",
    "home.activities.none": "Aucune activité disponible pour le moment. Revenez bientôt!",
    
    // Activities
    "activities.title": "Nos activités",
    "activities.search": "Rechercher une activité...",
    "activities.none": "Aucune activité disponible pour le moment.",
    "activities.noresults": "Aucune activité trouvée pour votre recherche.",
    "activities.date": "Date de l'activité:",
    "activities.location": "Lieu de l'activité:",
    
    // Activity Detail
    "activity.back": "Retour aux activités",
    "activity.share": "Partager",
    "activity.copied": "Lien copié dans le presse-papier!",
    
    // Courses
    "courses.title": "Cours de langue Kurde",
    "courses.desc": "Découvrez nos cours de langue kurde pour enfants et adultes",
    "courses.subtitle": "Préservons ensemble notre langue et notre culture",
    "courses.info.title": "Informations sur les cours",
    "courses.info.children": "Cours pour enfants (5-12 ans)",
    "courses.info.teens": "Cours pour adolescents (13-17 ans)",
    "courses.info.adults": "Cours pour adultes",
    "courses.info.desc": "Nos cours sont dispensés par des enseignants kurdes expérimentés qui ont à cœur de transmettre la richesse de notre langue et de notre culture.",
    "courses.schedule.title": "Horaires des cours",
    "courses.schedule.children": "Enfants : Mercredi 14h-16h",
    "courses.schedule.teens": "Adolescents : Mercredi 16h-18h",
    "courses.schedule.adults": "Adultes : Samedi 10h-12h",
    "courses.register": "S'inscrire aux cours",
    
    // About
    "about.title": "À propos de l'ACKG",
    "about.mission.title": "Notre mission",
    "about.mission.desc": "L'Association Culturelle Kurde de Genève (ACKG) a pour mission de préserver, défendre et développer les valeurs kurdes tout en favorisant l'intégration des Kurdes dans la société suisse.",
    "about.values.title": "Nos valeurs",
    "about.values.culture": "Préservation culturelle",
    "about.values.education": "Éducation et transmission",
    "about.values.solidarity": "Solidarité communautaire",
    "about.team.title": "Notre équipe",
    "about.contact.title": "Nous contacter",
    "about.contact.email": "Email",
    "about.contact.phone": "Téléphone",
    "about.contact.address": "Adresse",
    
    // Admin
    "admin.title": "Administration ACKG",
    "admin.username": "Nom d'utilisateur",
    "admin.password": "Mot de passe",
    "admin.login": "Se connecter",
    "admin.logout": "Déconnexion",
    "admin.success": "Connexion réussie!",
    "admin.error": "Identifiants incorrects",
    "admin.settings.title": "Paramètres du compte",
    "admin.settings.change": "Changer les identifiants",
    "admin.settings.newUsername": "Nouveau nom d'utilisateur",
    "admin.settings.newPassword": "Nouveau mot de passe",
    "admin.settings.save": "Enregistrer",
    "admin.settings.saved": "Identifiants mis à jour",
    "admin.addActivity.title": "Ajouter une activité",
    "admin.editActivity.title": "Modifier une activité",
    "admin.activity.title": "Titre de l'activité",
    "admin.activity.date": "Date de l'activité",
    "admin.activity.location": "Lieu de l'activité",
    "admin.activity.content": "Contenu",
    "admin.activity.images": "Images",
    "admin.activity.addImages": "Ajouter des images",
    "admin.activity.add": "Ajouter l'activité",
    "admin.activity.update": "Mettre à jour l'activité",
    "admin.activity.added": "Activité ajoutée avec succès!",
    "admin.activity.updated": "Activité mise à jour avec succès!",
    "admin.activity.deleted": "Activité supprimée",
    "admin.activity.deleteConfirm": "Êtes-vous sûr de vouloir supprimer cette activité ?",
    "admin.activity.fillAll": "Veuillez remplir tous les champs",
    "admin.activities.title": "Activités existantes",
    "admin.activities.none": "Aucune activité pour le moment",
    "admin.password.current": "Mot de passe actuel",
    "admin.password.new": "Nouveau mot de passe",
    "admin.password.confirm": "Confirmer le mot de passe",
    "admin.password.change": "Changer le mot de passe",
    "admin.password.changed": "Mot de passe modifié avec succès!",
    "admin.password.mismatch": "Les mots de passe ne correspondent pas",
    "admin.password.forgot": "Mot de passe oublié?",
    "admin.password.reset": "Réinitialiser le mot de passe",
    "admin.password.resetSent": "Email de réinitialisation envoyé!",
    "admin.user.add": "Ajouter un utilisateur admin",
    "admin.user.email": "Email",
    "admin.user.added": "Utilisateur ajouté avec succès!",
    "admin.activity.dateFilter": "Filtrer par date",
    "admin.activity.selectDate": "Sélectionner une date",
    
    // Footer
    "footer.description": "Association Culturelle Kurde de Genève",
    "footer.contact": "Contact",
    "footer.phone": "Téléphone",
    "footer.email": "Email",
    "footer.legal": "Informations légales",
    "footer.mentions": "Mentions légales",
    "footer.privacy": "Politique de confidentialité",
    "footer.copyright": "Tous droits réservés",
    
    // Legal
    "legal.title": "Mentions légales",
    "legal.association.title": "Association",
    "legal.association.name": "Nom de l'association",
    "legal.association.address": "Adresse du siège",
    "legal.association.phone": "Téléphone",
    "legal.association.email": "Email",
    "legal.editor.title": "Responsable de la publication",
    "legal.hosting.title": "Hébergement",
    "legal.hosting.provider": "Hébergeur",
    "legal.data.title": "Données personnelles",
    "legal.data.content": "Les données personnelles collectées via ce site sont uniquement utilisées dans le cadre des activités de l'association et ne sont jamais transmises à des tiers. Conformément à la loi fédérale sur la protection des données (LPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.",
    "legal.cookies.title": "Cookies",
    "legal.cookies.content": "Ce site n'utilise pas de cookies de traçage. Seuls des cookies techniques nécessaires au fonctionnement du site peuvent être utilisés.",
    "legal.property.title": "Propriété intellectuelle",
    "legal.property.content": "L'ensemble du contenu de ce site (textes, images, logos) est la propriété de l'Association Culturelle Kurde de Genève. Toute reproduction ou utilisation sans autorisation est interdite.",
    "legal.liability.title": "Limitation de responsabilité",
    "legal.liability.content": "L'ACKG s'efforce de maintenir les informations de ce site à jour et exactes. Toutefois, l'association ne peut être tenue responsable des erreurs, omissions ou résultats obtenus suite à l'utilisation de ces informations.",
  },
  ku: {
    // Navigation
    "nav.home": "سەرەکی",
    "nav.activities": "چالاکییەکان",
    "nav.courses": "وانەی زمان",
    "nav.about": "دەربارە",
    
    // Home
    "home.title": "کۆمەڵەی کولتووری کوردیی ژنێڤ",
    "home.subtitle": "بۆ بڵاوکردنەوەی کولتووری کوردی لە سویسرا",
    "home.mission.title": "ئەرکی ئێمە",
    "home.mission.culture.title": "پاراستنی کولتوور",
    "home.mission.culture.desc": "ئامانجی ئێمە پاراستن و بەرگری و پەرەپێدانی بەهاکانی کوردی و یەکخستنی کوردان لە کۆمەڵگای سویسرییە",
    "home.mission.language.title": "فێربوونی زمان",
    "home.mission.language.desc": "ئێمە وانەی زمان پێشکەش دەکەین بۆ هەموو کوردەکانی نیشتەجێی سویسرا. وانەکان لەلایەن مامۆستایانی کوردی بە ئەزموونەوە فێردەکرێن",
    "home.mission.activities.title": "چالاکی بۆ هەموان",
    "home.mission.activities.desc": "ڕێکخستنی بۆنە کولتووری و کۆمەڵایەتییەکان بۆ بەهێزکردنی پەیوەندییەکان لە نێوان کوردانی نیشتەجێی سویسرا",
    "home.courses.title": "وانەی زمانی کوردی",
    "home.courses.desc": "مامۆستاکانی کۆمەڵگای کوردی لە ژنێڤ دڵسۆزن لە گەیاندنی دەوڵەمەندی زمان و کولتوورمان. وانە گونجاوە بۆ منداڵان، لە تەمەنی ٥ ساڵییەوە کە سوودمەند دەبن لە فێربوونێکی گونجاو، یاریکردنەوە و هانبدەر. وانە بۆ گەورەکانیش بەردەستە.",
    "home.courses.button": "زانیاری زیاتر",
    "home.support.title": "پشتیوانیکردنی بڵاوکردنەوەی کولتووری کوردی",
    "home.support.desc": "پشتیوانی ئێوە یارمەتیمان دەدات بۆ بەردەوامبوون لە ئەرکی پاراستن و بڵاوکردنەوەی کولتووری کوردی لە سویسرا. هەر بەشدارییەک جیاوازی دروست دەکات.",
    "home.support.button": "بەخشین",
    "home.princess.title": "سەردانی شازادە کوردییە",
    "home.princess.desc": "ئێمە شانازیمان پێوەیە کە سەردانی شازادە کوردییەمان پێکرا لە بۆنە کولتوورییە ساڵانەکەماندا. چاوپێکەوتنێکی لەبیرنەکراو کە شایەتی گرنگی میراتمان و نەریتەکانمانە.",
    "home.princess.button": "دۆزینەوەی بۆنەکە",
    "home.activities.title": "چالاکییەکانمان",
    "home.activities.viewAll": "بینینی هەموو",
    "home.activities.desc": "ئێمە چالاکیی زۆر ڕێکدەخەین، کراوەیە بۆ هەموان!",
    "home.activities.none": "هیچ چالاکییەک لە ئێستادا بەردەست نییە. دواتر بگەڕێنەوە!",
    
    // Activities
    "activities.title": "چالاکییەکانمان",
    "activities.search": "گەڕان بۆ چالاکی...",
    "activities.none": "هیچ چالاکییەک لە ئێستادا بەردەست نییە.",
    "activities.noresults": "هیچ چالاکییەک نەدۆزرایەوە بۆ گەڕانەکەت.",
    "activities.date": "بەرواری چالاکی:",
    "activities.location": "شوێنی چالاکی:",
    
    // Activity Detail
    "activity.back": "گەڕانەوە بۆ چالاکییەکان",
    "activity.share": "هاوبەشکردن",
    "activity.copied": "بەستەر کۆپی کرا!",
    
    // Courses
    "courses.title": "وانەی زمانی کوردی",
    "courses.desc": "وانەکانی زمانی کوردیمان بۆ منداڵان و گەورەکان بدۆزەرەوە",
    "courses.subtitle": "با پێکەوە زمان و کولتوورمان بپارێزین",
    "courses.info.title": "زانیاری دەربارەی وانەکان",
    "courses.info.children": "وانە بۆ منداڵان (٥-١٢ ساڵ)",
    "courses.info.teens": "وانە بۆ لاوان (١٣-١٧ ساڵ)",
    "courses.info.adults": "وانە بۆ گەورەکان",
    "courses.info.desc": "وانەکانمان لەلایەن مامۆستایانی کوردی بە ئەزموونەوە پێشکەش دەکرێن کە دڵسۆزن لە گەیاندنی دەوڵەمەندی زمان و کولتوورمان.",
    "courses.schedule.title": "کاتی وانەکان",
    "courses.schedule.children": "منداڵان: چوارشەممە ٢-٤ی دوای نیوەڕۆ",
    "courses.schedule.teens": "لاوان: چوارشەممە ٤-٦ی دوای نیوەڕۆ",
    "courses.schedule.adults": "گەورەکان: شەممە ١٠-١٢ی بەیانی",
    "courses.register": "تۆمارکردن لە وانەکان",
    
    // About
    "about.title": "دەربارەی ACKG",
    "about.mission.title": "ئەرکی ئێمە",
    "about.mission.desc": "کۆمەڵەی کولتووری کوردیی ژنێڤ (ACKG) ئەرکی ئەوەی هەیە کە بەهاکانی کوردی بپارێزێت و بەرگری لێ بکات و پەرەی پێبدات، لەهەمان کاتدا یارمەتی یەکخستنی کوردان بدات لە کۆمەڵگای سویسری.",
    "about.values.title": "بەهاکانی ئێمە",
    "about.values.culture": "پاراستنی کولتووری",
    "about.values.education": "پەروەردە و گەیاندن",
    "about.values.solidarity": "یەکڕیزی کۆمەڵایەتی",
    "about.team.title": "تیمەکەمان",
    "about.contact.title": "پەیوەندیکردن",
    "about.contact.email": "ئیمەیڵ",
    "about.contact.phone": "تەلەفۆن",
    "about.contact.address": "ناونیشان",
    
    // Admin
    "admin.title": "بەڕێوەبردنی ACKG",
    "admin.username": "ناوی بەکارهێنەر",
    "admin.password": "وشەی تێپەڕ",
    "admin.login": "چوونەژوورەوە",
    "admin.logout": "چوونەدەرەوە",
    "admin.success": "چوونەژوورەوە سەرکەوتوو بوو!",
    "admin.error": "ناسنامە هەڵەیە",
    "admin.settings.title": "ڕێکخستنەکانی هەژمار",
    "admin.settings.change": "گۆڕینی ناسنامە",
    "admin.settings.newUsername": "ناوی بەکارهێنەری نوێ",
    "admin.settings.newPassword": "وشەی تێپەڕی نوێ",
    "admin.settings.save": "پاشەکەوتکردن",
    "admin.settings.saved": "ناسنامە نوێکرایەوە",
    "admin.addActivity.title": "زیادکردنی چالاکی",
    "admin.editActivity.title": "دەستکاریکردنی چالاکی",
    "admin.activity.title": "ناونیشانی چالاکی",
    "admin.activity.date": "بەرواری چالاکی",
    "admin.activity.location": "شوێنی چالاکی",
    "admin.activity.content": "ناوەڕۆک",
    "admin.activity.images": "وێنەکان",
    "admin.activity.addImages": "زیادکردنی وێنە",
    "admin.activity.add": "زیادکردنی چالاکی",
    "admin.activity.update": "نوێکردنەوەی چالاکی",
    "admin.activity.added": "چالاکی بە سەرکەوتوویی زیادکرا!",
    "admin.activity.updated": "چالاکی بە سەرکەوتوویی نوێکرایەوە!",
    "admin.activity.deleted": "چالاکی سڕایەوە",
    "admin.activity.deleteConfirm": "دڵنیای کە دەتەوێت ئەم چالاکییە بسڕیتەوە؟",
    "admin.activity.fillAll": "تکایە هەموو خانەکان پڕبکەرەوە",
    "admin.activities.title": "چالاکییە بوونەکان",
    "admin.activities.none": "هیچ چالاکییەک لە ئێستادا",
    "admin.password.current": "وشەی تێپەڕی ئێستا",
    "admin.password.new": "وشەی تێپەڕی نوێ",
    "admin.password.confirm": "دووپاتکردنەوەی وشەی تێپەڕ",
    "admin.password.change": "گۆڕینی وشەی تێپەڕ",
    "admin.password.changed": "وشەی تێپەڕ بە سەرکەوتوویی گۆڕدرا!",
    "admin.password.mismatch": "وشەی تێپەڕەکان یەکناگرنەوە",
    "admin.password.forgot": "وشەی تێپەڕت لەبیرچووە؟",
    "admin.password.reset": "دووبارە ڕێکخستنەوەی وشەی تێپەڕ",
    "admin.password.resetSent": "ئیمەیڵی دووبارە ڕێکخستنەوە نێردرا!",
    "admin.user.add": "زیادکردنی بەکارهێنەری بەڕێوەبەر",
    "admin.user.email": "ئیمەیڵ",
    "admin.user.added": "بەکارهێنەر بە سەرکەوتوویی زیادکرا!",
    "admin.activity.dateFilter": "پاڵاوتن بە بەروار",
    "admin.activity.selectDate": "هەڵبژاردنی بەروار",
    
    // Footer
    "footer.description": "کۆمەڵەی کولتووری کوردیی ژنێڤ",
    "footer.contact": "پەیوەندی",
    "footer.phone": "تەلەفۆن",
    "footer.email": "ئیمەیڵ",
    "footer.legal": "زانیاری یاسایی",
    "footer.mentions": "باسکردنی یاسایی",
    "footer.privacy": "سیاسەتی تایبەتێتی",
    "footer.copyright": "هەموو مافەکان پارێزراون",
    
    // Legal
    "legal.title": "باسکردنی یاسایی",
    "legal.association.title": "کۆمەڵە",
    "legal.association.name": "ناوی کۆمەڵە",
    "legal.association.address": "ناونیشانی بنکە",
    "legal.association.phone": "تەلەفۆن",
    "legal.association.email": "ئیمەیڵ",
    "legal.editor.title": "بەرپرسی بڵاوکردنەوە",
    "legal.hosting.title": "میوانداری",
    "legal.hosting.provider": "میواندار",
    "legal.data.title": "زانیاری تایبەت",
    "legal.data.content": "زانیاری تایبەتی کۆکراوە لە ڕێگەی ئەم ماڵپەڕەوە تەنها بەکاردێت لە چوارچێوەی چالاکییەکانی کۆمەڵە و هەرگیز نادرێتە لایەنی سێیەم. بەپێی یاسای فیدراڵی پاراستنی داتا (LPD)، تۆ مافی دەستگەیشتن، ڕاستکردنەوە و سڕینەوەی زانیاریە تایبەتەکانت هەیە.",
    "legal.cookies.title": "کووکیز",
    "legal.cookies.content": "ئەم ماڵپەڕە کووکیی شوێنکەوتن بەکارناهێنێت. تەنها کووکیی تەکنیکی پێویست بۆ کارکردنی ماڵپەڕەکە دەکرێت بەکاربهێنرێت.",
    "legal.property.title": "موڵکی هونەری",
    "legal.property.content": "هەموو ناوەڕۆکی ئەم ماڵپەڕە (دەق، وێنە، لۆگۆ) موڵکی کۆمەڵەی کولتووری کوردیی ژنێڤە. هەر بەرهەمهێنانەوە یان بەکارهێنانێک بەبێ ڕێپێدان قەدەغەیە.",
    "legal.liability.title": "سنووردارکردنی بەرپرسیارێتی",
    "legal.liability.content": "ACKG هەوڵدەدات زانیاریەکانی ئەم ماڵپەڕە نوێ و دروست ڕابگرێت. بەڵام، کۆمەڵە ناتوانرێت بەرپرسیار بگیرێت بۆ هەڵە، لابردن یان ئەنجامەکانی بەدەستهاتوو دوای بەکارهێنانی ئەم زانیاریانە.",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
