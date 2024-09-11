const cheerio = require('cheerio');
const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');
// Fonction pour nettoyer le texte
function cleanText(text) {
    // Remplace le caractère '' par '’'
    return text.replace(//g, '’');
}
// Fonction pour générer un document Word à partir de contenu HTML
async function generateWordFromHtml(outerHTML) {
    try {
        // Charger le contenu HTML avec cheerio
        const $ = cheerio.load(outerHTML);

        // Sélectionner le div avec l'id "mediaBody"
        const mediaBody = $('.media-body');
        if (mediaBody.length === 0) {
            throw new Error('L\'élément .media-body n\'a pas été trouvé.');
        }

        // Créer un nouveau document Word avec une seule section


        // Sélectionner les éléments h6 et p dans l'ordre
        const elements = [];
        let children = []
        mediaBody.find('h6.title_sommaire, p').each((index, element) => {
            elements.push({
                tag: element.name,
                text: $(element).text().trim()
            });
        });

        // Ajouter les éléments au document Word dans la section existante
        elements.forEach((el, index) => {
            let paragraph;
            if (el.tag === 'h6') {
                paragraph = new Paragraph({
                    border: index === 0 ? {
                        top: { style: BorderStyle.SINGLE, size: 2, space: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 2, space: 1 },
                        left: { style: BorderStyle.SINGLE, size: 2, space: 1 },
                        right: { style: BorderStyle.SINGLE, size: 2, space: 1 },
                    } : undefined,
                    alignment: AlignmentType.CENTER,
                    heading: HeadingLevel.TITLE,
                    children: [
                        new TextRun({
                            text: el.text,
                            bold: true,
                            font: "Calibri",
                            size: index === 0 ? 40 : 32,
                        })
                    ],
                });
            } else if (el.tag === 'p') {
                paragraph = new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                        new TextRun({
                            text: el.text,
                            font: "Calibri",
                            size: 32,
                        })
                    ],
                });
            }

            // Ajouter le paragraphe à la section existante
            children.push(paragraph);

            // Ajouter une ligne vide pour séparer les paragraphes
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: '',
                        font: "Calibri",
                        size: 82,
                    })
                ],
            }));
        });
        const doc = new Document({
            sections: [
                {
                    children: children
                }
            ]
        });
        // Générer le fichier Word
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync('output.docx', buffer);

        console.log('Le fichier Word a été généré avec succès.');

    } catch (error) {
        console.error('Erreur:', error.message);
    }
}

// Exemple d'utilisation
const exampleOuterHTML = `<div class="media-body">
                
                <template x-if="fields">
                    <div class="row">
                        <template x-for="field in fields">
                            <div :class="field.type !== 'text' ? 'col-sm-12 flex' : 'col-sm-12'" x-init="getContentFieldRule('62b45e703ed517292666dab5', field._id)">
                                
                                <template x-if="contents.get('62b45e703ed517292666dab5_'+field._id)">
                                    <span class="content-group" x-html="contents.get('62b45e703ed517292666dab5_'+field._id)"></span>
                                </template>
                            </div>
                        </template>
                    </div>
                </template><div class="row">
                        <template x-for="field in fields">
                            <div :class="field.type !== 'text' ? 'col-sm-12 flex' : 'col-sm-12'" x-init="getContentFieldRule('62b45e703ed517292666dab5', field._id)">
                                
                                <template x-if="contents.get('62b45e703ed517292666dab5_'+field._id)">
                                    <span class="content-group" x-html="contents.get('62b45e703ed517292666dab5_'+field._id)"></span>
                                </template>
                            </div>
                        </template>
                    </div>
                
                                <template x-if="items.length > 0">
                    <template x-for="item in items">
                        <div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div>
                    </template>
                </template><template x-for="item in items">
                        <div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div>
                    </template><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">LOI N° 98-755 DU 23 DECEMBRE 1998 &nbsp;PORTANT CODE DE L'EAU</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">TITRE PREMIER - DISPOSITIONS GENERALES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE PREMIER - DEFINITIONS</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 1</h6>
                                    <p x-html="item.content">Au sens de la présente loi portant Code de l'Eau, on entend par:<br>&nbsp;<br>Autorité : tout détenteur du pouvoir tant à léchelle nationale que locale;<br>&nbsp;<br>Autorité chargée de leau : structure désignée pour la gestion des ressources en eau ;<br>&nbsp;<br>Assainissement : collecte, évacuation et rejet ou destruction selon les exigences sanitaires, avec ou sans traitement préalable, des eaux pluviales, des eaux usées ou des déchets solides ;<br>&nbsp;<br>Bassin versant : aire géographique dont le relief détermine lécoulement des eaux superficielles et des effluents de diverses natures vers un point de convergence ; ce point est appelé exutoire du bassin ;<br>&nbsp;<br>Captage :<br>&nbsp;<br>1° Action de prélever de l'eau de source, lac ou rivière, pour l'alimentation dune adduction ;<br>&nbsp;<br>2° Dispositif de prélèvement contrôle des eaux de source ;<br>&nbsp;<br>3° Canal ou conduite de dérivation dun lac ou dun cours d'eau pour les besoins agricoles, domestiques ou industriels ;<br>&nbsp;<br>Eau ou ressources en eau : l'eau est un liquide transparent, incolore, inodore et sans saveur à létat pur. Les termes eaux et ressources en eau sont utilisés de façon interchangeable ;<br>&nbsp;<br>Eau de surface : toutes les étendues d'eau y compris leur dépendances légales en contact avec l'atmosphère (à la surface de la terre)&nbsp;;<br>Eau minérale : eau provenant d'une nappe souterraine contenant des sels minéraux dotée de propriétés chimiques favorables à la santé ;<br>&nbsp;<br>Eau potable : toute eau est considérée comme potable si elle n'affecte pas la santé du consommateur à court, moyen et long terme. Ses caractéristiques physico-chimiques et micro- biologiques font l'objet de dispositions réglementaires ;<br>&nbsp;<br>Eau sacrée : eau considérée ou utilisée, avec ou sans son contenu par une communauté qui appelle un respect absolu digne d'adoration et de vénération ;<br>&nbsp;<br>Eau souterraine : toutes les eaux contenues dans les roches réservoirs dans le sous-sol, localisées en dessous de la couche hypodermique du sol (zone non saturée) ;<br>&nbsp;<br>Eaux ou mers territoriales : zone de mer s'étendant des côtes d'un pays jusqu'à une ligne considérée comme sa frontière maritime. Cette frontière est définie par la Convention de Montego bay du 10 décembre 1982 à douze miles (1 mile = 1 609 mètres) :<br>&nbsp;<br>Fonds supérieur : espace ou domaine situé à l'amont (supérieur) et à l'aval (inférieur) ;<br>&nbsp;<br>Forage : creusement d'un trou circulaire de diamètre pré défini, à partir de la surface du sol jusquà une couche, une zone aquifère et est muni d'un système mécanique délévation pour en tirer de leau ;<br>&nbsp;<br>Franc bord : terrain libre de propriétaire, en bordure d'une rivière ou dun canal, dont les dimensions font l'objet de dispositions réglementaires ;<br>&nbsp;<br>Nappe phréatique : nappe souterraine, peu profonde, facilement atteinte par des puits ;<br>&nbsp;<br>Périmètre de protection<br>&nbsp;<br>- Périmètre de protection immédiat ; aire clôturée où toute activité, installation ou dépôt sont interdits en dehors de ceux explicitement autorisés ;<br>- Périmètre de protection rapproché ; aire où peuvent y être interdits ou réglementés toute activité ou tout dépôt de nature à nuire directement ou indirectement à la qualité des eaux. Ces terrains peuvent être acquis par voie d'expropriation ;<br>- Périmètre éloigné ; aire où les activités peuvent être réglementées si elles présentent un risque de pollution ;<br>&nbsp;<br>Principe d'information et de participation : toute personne a le droit dêtre informée de l'état des ressources en eau et de participer aux procédures préalables à la prise de décisions susceptibles d'avoir des effets préjudiciables sur les ressources en eau ;<br>&nbsp;<br>Principe de planification et de coopération : les autorités publiques, les Institutions internationales, les associations non gouvernementales et les particuliers concourent à protéger les ressources en eau à tous les niveaux possibles, à participer à l'élaboration de schéma directeur des ressources en eau ;<br>&nbsp;<br>Principe de précaution et de prévention : les mesures préliminaires prises de manière à éviter ou à réduire tout risque ou tout danger pour un milieu donné (ressources en eau) lors de la planification ou de lexécution des activités susceptibles davoir un impact dans ce milieu environnemental ;<br>&nbsp;<br>Pollution des eaux : l'introduction dans le milieu aquatique de toute substance susceptible de modifier les caractéristiques physiques, chimiques et/ou biologiques de l'eau et de créer des risques pour la santé de l'homme, de nuire à la faune et à la flore terrestres et aquatiques, de porter atteinte à l'agrément des sites ou de gêner toute autre utilisation rationnelle des eaux ;<br>&nbsp;<br>Principe pollueur - payeur : ensemble de règles définies qui sanctionne toute personne physique ou morale qui directement ou indirectement, provoque une modification défavorable dans un milieu donné par l'introduction de substances nocives. Les dommages causés sont soumis à une taxe ou/et redevance ;<br>&nbsp;<br>Principe usager - payeur : ensemble de règles définies qui permettent de faire une tarification de l'utilisation de l'eau selon les usages. Ces utilisations sont soumises à une taxe ou/et à une redevance ;<br>&nbsp;<br>Puits : excavation creusée à partir de la surface du sol, jusqu'à une couche, un terrain aquifère, pour en tirer de l'eau ;<br>&nbsp;<br>Réseau d'assainissement et de drainage : ensemble d'ouvrages destinés à collecter et évacuer les eaux usées ou pluviales;<br>&nbsp;<br>Réseau-hydrographique : ensemble des canaux de drainage, naturels permanents où s'écoulent les eaux provenant du ruissellement ou restituées par les nappes souterraines, soit sous forme de sources, soit par restitution continue le long du lit du cours d'eau ;<br>&nbsp;<br>Zone humide : terrains exploités ou non, habituellement inondés ou gorgés deau douce Salée, ou Saumâtre de façon permanente ou temporaire. La Végétation quand elle existe, y est dominée par des plantes hygrophiles pendant au moins une partie de lannée ;<br>&nbsp;<br>Etude d'impact environnemental ; ensemble des procédés utilisés pour évaluer les effets dune donnée ou dune activité sur l'environnement et proposer toute mesure ou action en vue de faire disparaître, réduire ou atténuer les effets néfastes pour l'environnement susceptibles d'être engendrés par une telle activité.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 2 - DOMAINE D'APPLICATION</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 2</h6>
                                    <p x-html="item.content">La présente loi portant Code de l'Eau détermine les principes fondamentaux applicables :<br>&nbsp;<br>- au régime juridique des eaux, des aménagements et ouvrages hydrauliques ;<br>- au régime de protection des eaux, des aménagements et ouvrages hydrauliques ;<br>- à la gestion des eaux, des aménagements et ouvrages hydrauliques.<br>&nbsp;<br>Il précise les règles générales :<br>&nbsp;<br>- de préservation et de répartition des eaux ;<br>- de préservation, de qualité des aménagements et ouvrages hydrauliques ;<br>- d'utilisation harmonieuse des eaux sacrées ;<br>- de la Police des eaux, des infractions et sanctions.<br>&nbsp;<br>Les eaux définies dans la présente loi portant Code de l'Eau comprennent les eaux continentales et les eaux de la mer territoriale.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 3</h6>
                                    <p x-html="item.content">Sont soumis aux dispositions de la présente loi :<br>&nbsp;<br>- les personnes physiques ou morales, de droit public ou privé, exerçant une activité en rapport avec les ressources, en eau ;<br>- les aménagements et ouvrages hydrauliques ;<br>- les installations classées conformément aux lois et règlements en vigueur ;<br>- les installations non classées, les ouvrages et activités réalisés à des fins domestiques ou non, par toute personne physique ou morale, de droit public ou privé et entraînant soit des prélèvements sur les eaux de surface ou les eaux souterraines, restituées ou non, soit une modification des déversements, écoulements, rejets ou dépôts directs ou indirects, chroniques ou épisodiques, même non polluants.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 4</h6>
                                    <p x-html="item.content">La présente loi portant Code de l'Eau ne s'applique pas:<br>&nbsp;<br>- aux situations de guerre ;<br>- aux activités militaires. Toutefois, les auteurs de telles activités sont tenus de prendre en compte les préoccupations de protection des ressources en eau, des aménagements et ouvrages hydrauliques et de veiller à cet effet à ne porter atteinte au domaine public hydraulique tel que défini à larticle 11 de la présente loi portant Code de lEau.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 3 - OBJECTIFS</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 5</h6>
                                    <p x-html="item.content">La présente loi portant Code de lEau a pour objet une gestion intégrée des ressources en eau, des aménagements et ouvrages hydrauliques.<br>&nbsp;<br>Cette gestion vise à assurer :<br>- la préservation des écosystèmes aquatiques, des sites et des zones humides ;<br>- la protection contre toute forme de pollution, la restauration des eaux de surface, des eaux souterraines et des eaux de la mer dans la limite des eaux territoriales;<br>- la protection, la mobilisation et la gestion des ressources en eau ;<br>- le développement et la protection des aménagements et ouvrages hydrauliques ;<br>- la valorisation de l'eau comme ressource économique et sa répartition de manière à satisfaire ou à concilier, lors des différents usages, activités ou travaux, les exigences:<br>* de l'alimentation en eau potable de la population ;<br>* de la santé, de la salubrité publique, de la protection civile;<br>* de la conservation et du libre écoulement des eaux et de la protection contre les inondations ;<br>* de l'agriculture, de la pêche et des cultures marines, de la pêche en eau douce, de l'industrie, de la production d'énergie, des transports, du tourisme, des loisirs et des sports nautiques ainsi que toutes les autres activités humaines légalement exercées ;<br>- la planification cohérente de l'utilisation des ressources en eau tant à l'échelle du bassin versant hydrologique qu'à l'échelle nationale ;<br>- lamélioration des conditions de vie des différents types de populations, dans le respect de léquilibre avec le milieu ambiant ;<br>- les conditions d'une utilisation rationnelle et durable des ressources en eau pour les générations présentes et futures ;<br>- la mise en place d'un cadre institutionnel caractérisé par la redéfinition du rôle des intervenants.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 4 - PRINCIPES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 6</h6>
                                    <p x-html="item.content">La présente loi portant Code de lEau adhère aux principes admis dans la gestion intégrée des ressources en eau que sont les principes de précaution, de prévention, de correction, de participation, d'usager-payeur, de pollueur-payeur, de planification et de coopération.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 7</h6>
                                    <p x-html="item.content">L'eau fait partie du patrimoine commun national.<br>&nbsp;<br>Sa protection, sa mobilisation et sa mise en valeur, dans le respect des équilibres naturels, sont dintérêt général :<br>&nbsp;<br>Elle ne peut faire lObjet dappropriation que dans les conditions déterminées par les dispositions de la présente loi.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 8</h6>
                                    <p x-html="item.content">Lutilisation des ressources en eau se fait dans les conditions déterminées par les lois et règlements en vigueur et les dispositions de la présente loi portant Code de lEau, sous réserve du respect des droits antérieurement acquis sur le domaine public hydraulique tel que défini à larticle 11 de la présente loi et des droits des tiers.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 9</h6>
                                    <p x-html="item.content">La gestion et la mise en valeur des ressources en eau, des aménagements et ouvrages hydrauliques doivent associer à tous les échelons:<br>&nbsp;<br>- les planificateurs, les décideurs et les spécialistes, en la matière ; <br>- les exploitants ;<br>- les usagers</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 10</h6>
                                    <p x-html="item.content">Lexistence des eaux sacrées est tolérée. Toutefois, leur utilisation doit être conforme à lintérêt général et répondre aux impératifs de maintien et de renforcement de la cohésion du groupe social et de l'unité nationale.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">TITRE ii - REGIME JURIDIQUE DES EAUX, DES AMENAGEMENTS ET OUVRAGES HYDRAULIQUES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE PREMIER - DISPOSITIONS COMMUNES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 11</h6>
                                    <p x-html="item.content">Font partie du domaine public hydraulique, au sens de la présente loi portant Code de lEau :<br>&nbsp;<br>a) Les ressources en eau, notamment :<br>&nbsp;<br>- les eaux de la mer territoriale ;<br>- les cours deau navigables ou flottables dans les limites déterminées par la hauteur des eaux coulant à plein bord avant de déborder, ainsi qu'une zone de passage de vingt-cinq mètres de large à partir de ces limites sur chaque rive et sur chacun des bords des îles ;<br>- les sources et cours d'eau non navigables ni flottables dans les limites déterminées par la hauteur des eaux coulant à plein bord avant de déborder ;<br>- les lacs, étangs et lagunes dans les limites déterminées par le niveau des plus hautes eaux avant le débordement avec une zone de vingt-cinq mètres de large à partir de ces limites sur chaque rive extérieure et sur chacun des bords des îles ;<br>- les nappes aquifères souterraines.<br>&nbsp;<br>b) Les aménagements et ouvrages hydrauliques installés sur le domaine public, notamment :<br>&nbsp;<br>- les canaux de navigation et leurs chemins de halage. Les canaux d'irrigation et de dessèchement et les aqueducs exécutés dans un but dutilité publique, ainsi que les dépendances de ces ouvrages ;<br>- les conduites d'eau, les conduites d'égouts, les ports et rades, les digues maritimes et fluviales, les ouvrages d'éclairage, et de balisage ainsi que leurs dépendances&nbsp;;<br>- les ouvrages déclarés d'utilité publique en vue de lutilisation des forces Hydrauliques.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 12</h6>
                                    <p x-html="item.content">Les prélèvements dans les eaux du domaine public hydraulique et la réalisation d'aménagements ou douvrages hydrauliques sont soumis selon les cas, à autorisation ou à déclaration préalable.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 13</h6>
                                    <p x-html="item.content">Toute autorisation doit :<br>&nbsp;<br>- préserver le patrimoine ; <br>- prendre en compte les droits et usages antérieurement établis ;<br>- concilier les intérêts des diverses catégories d'utilisateurs.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 14</h6>
                                    <p x-html="item.content">L'autorisation est accordée, sous réserve du droit des tiers, pour une durée déterminée et le cas échéant après enquête publique.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 15</h6>
                                    <p x-html="item.content">L'autorisation peut être retirée ou modifiée avec indemnisation:<br>&nbsp;<br>- dans l'intérêt de la salubrité publique, et notamment lorsque ce retrait ou cette modification est nécessaire à l'alimentation en eau potable ;<br>- pour prévenir ou faire cesser les inondations ou en cas de menace pour la sécurité publique ;<br>- en cas de menace majeure pour le milieu aquatique, et notamment lorsque les milieux sont soumis à des conditions hydrauliques critiques non compatibles avec leur préservation.<br>&nbsp;<br>L'autorisation peut être retirée à tout moment, sans indemnité, après une mise en demeure adressée à l'intéresse par écrit :<br>&nbsp;<br>- si l'objet pour lequel elle a été accordée n'a pas reçu un commencement d'exécution dans un délai de deux ans&nbsp;;<br>- lorsque les ouvrages ou installations sont abandonnés ou ne font plus l'objet dun entretien régulier ;<br>- en cas d'inobservation des conditions prescrites dans l'autorisation.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 16</h6>
                                    <p x-html="item.content">Tout refus, retrait ou modification d'autorisation doit être motivé.<br>&nbsp;<br>Un décret pris en application de la présente loi portant Code de l'Eau détermine les conditions d'octroi, de modification, de renouvellement et de retrait des autorisations, et les seuils relatifs aux débits prélevés sur le domaine public hydraulique.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 17</h6>
                                    <p x-html="item.content">Le droit d'usage de l'eau et l'utilisation des aménagements et ouvrages hydrauliques sont limités par l'obligation de ne pas porter atteinte aux droits des riverains et de restituer l'eau de façon qu'elle soit réutilisable.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 18</h6>
                                    <p x-html="item.content">Toute exploitation ou installation relative à l'utilisation des ressources en eau dans un but d'intérêt général grève les fonds de terre intermédiaires d'une servitude de passage, d'implantation, d'appui et de circulation, conformément aux lois et règlements en vigueur.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 19</h6>
                                    <p x-html="item.content">Les aménagements et ouvrages hydrauliques doivent comporter des dispositifs maintenant une quantité minimale d'eau qui garantisse en permanence la vie, la circulation et la reproduction des espèces.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 20</h6>
                                    <p x-html="item.content">En cas d'accumulation d'eau sur fonds privé, l'exploitant du fonds peut être tenu d'en déclarer la capacité, la nature et la finalité.<br>&nbsp;<br>Les conditions d'accumulation artificielle des eaux sur les propriétés privées sont fixées par voie réglementaire.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 2 - DU REGIME DES EAUX</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 21</h6>
                                    <p x-html="item.content">Les ressources en eau comprennent :<br>&nbsp;<br>- les eaux atmosphériques ou météoriques ;<br>- les eaux de surface ;<br>- les eaux souterraines ;<br>- les eaux de la mer territoriale.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section première - Les eaux atmosphériques ou météoriques</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 22</h6>
                                    <p x-html="item.content">Les eaux atmosphériques ou météoriques appartiennent à celui qui les reçoit sur son fonds. Il a le droit den user et den disposer.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 23</h6>
                                    <p x-html="item.content">Laccumulation artificielle des eaux tombant sur fonds privé est autorisée à condition que :<br>&nbsp;<br>- ces eaux demeurent sur ce fonds ;<br>- leur utilisation soit conforme aux prescriptions édictées par les lois et règlements en vigueur.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 24</h6>
                                    <p x-html="item.content">Conformément aux lois et règlements en vigueur, tout propriétaire doit établir des toits ou ouvrages de manière que les eaux pluviales sécoulent sur son terrain ou sur la voie publique.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section 2 - Les eaux de surface et les eaux souterraines</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 25</h6>
                                    <p x-html="item.content">Nul ne doit empêcher le libre écoulement des eaux de surface et des eaux souterraines.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 26</h6>
                                    <p x-html="item.content">Les eaux de source peuvent être utilisées par celui qui a une source dans son fonds privé de terre, sous réserve du respect des dispositions prévues aux articles 17, 18 et 32 de la présente loi portant Code de l'Eau.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section 3 - Les eaux sacrées</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 27</h6>
                                    <p x-html="item.content">La gestion des eaux sacrées est assurée par la collectivité concernée sous le contrôle de l'Etat.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 28</h6>
                                    <p x-html="item.content">L'utilisation des eaux sacrées doit concilier :<br>&nbsp;<br>- les impératifs de préservation du patrimoine national ;<br>- le respect des droits des tiers ;<br>- le souci de préservation et de renforcement de la cohésion du groupe social et de l'unité nationale.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 3 - DU REGIME APPLICABLE AUX AMENAGEMENTS ET OUVRAGES HYDRAULIQUES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 29</h6>
                                    <p x-html="item.content">Les aménagements et ouvrages hydrauliques soumis au régime d'autorisation font l'objet d'une étude d'impact environnemental préalable.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 30</h6>
                                    <p x-html="item.content">L'emplacement, la réalisation et l'exploitation des aménagements et ouvrages hydrauliques sont soumis, selon les cas, à autorisation ou à déclaration préalable, conformément aux dispositions des articles 31 et 32 de la présente loi portant Code de l'Eau.<br>&nbsp;<br>L'implantation est précédée de l'intervention :<br>&nbsp;<br>- d'un expert hydrologue ou hydrogéologue pour les ouvrages et aménagements hydrauliques soumis à autorisation ;<br>- des services de l'autorité chargée de l'eau et des ministères compétents pour les aménagements et ouvrages hydrauliques soumis à déclaration.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 31</h6>
                                    <p x-html="item.content">dentraver la navigation, de présenter des dangers pour la santé et la sécurité publique, de nuire au libre écoulement des eaux, de dégrader la qualité et la quantité des ressources en eau, daccroître notablement le risque d'inondation, de porter gravement atteinte à la qualité ou à la diversité du milieu aquatique.<br>&nbsp;<br>Sont soumis à déclaration préalable, les installations, ouvrages, travaux et activités qui, n'étant pas susceptibles de présenter de tels dangers, doivent néanmoins respecter les prescriptions édictées par la législation en vigueur.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 32</h6>
                                    <p x-html="item.content">Tout aménagement ou ouvrage de déviation ou de dérivation de la ressource en eau qui prive les autres usagers de la jouissance normale est interdit.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 33</h6>
                                    <p x-html="item.content">Tout exploitant d'un aménagement ou ouvrage hydraulique doit notifier, par écrit, à l'autorité compétente :<br>&nbsp;<br>- les événements importants et accidents survenus;<br>- le changement d'exploitant ;<br>- la cessation d'activité.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">TITRE III - REGIME DE PROTECTION DES EAUX, DES AMENAGEMENTS ET OUVRAGES HYDRAULIQUES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE PREMIER - DISPOSITIONS COMMUNES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 34</h6>
                                    <p x-html="item.content">La protection des ressources en eau, des aménagements et ouvrages hydrauliques est assurée au moyen : <br>- de mesures de police ;<br>- de normes ;<br>- de périmètre de protection ;<br>- de mesures de classement et de déclassement ;<br>- du régime d'utilité publique.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 35</h6>
                                    <p x-html="item.content">Toute activité susceptible de dégrader les ressources en eau, les aménagements et ouvrages hydrauliques fait l'objet de mesures de réglementation par l'autorité compétente.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 36</h6>
                                    <p x-html="item.content">En vue de protéger les ressources en eau, les aménagements et ouvrages hydrauliques, il est institué des normes et des périmètres de protection.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 37</h6>
                                    <p x-html="item.content">Les normes telles que précisées à l'article précédent sont :<br>&nbsp;<br>- les normes de qualité des ressources en eau ;<br>- les normes de rejet ;<br>- les normes de conception, de mise en uvre et de protection des aménagements et ouvrages hydrauliques.<br>&nbsp;<br>Ces normes sont déterminées en fonction des différents usages, en tenant compte notamment :<br>&nbsp;<br>- des données scientifiques les plus récentes en la matière;<br>- de l'état du milieu récepteur ;<br>- de la capacité d'auto-épuration de l'eau ;<br>- des impératifs du développement économique et social national ;<br>- des contraintes de rentabilité financière.<br>&nbsp;<br>Ces normes sont fixées par voie réglementaire.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 38</h6>
                                    <p x-html="item.content">Le périmètre de protection, en tant que mesure de salubrité publique, est obligatoire.<br>&nbsp;<br>Il existe trois types de périmètre de protection :<br>&nbsp;<br>- Le périmètre de protection immédiat ;<br>- Le périmètre de protection rapproché ;<br>- Le périmètre de protection éloigné.<br>&nbsp;<br>Les limites de ces périmètres sont déterminées par décret. Elles peuvent être modifiées si de nouvelles circonstances l'exigent.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 39</h6>
                                    <p x-html="item.content">Toute activité autre que celle pour laquelle le périmètre de protection immédiat a été défini est interdite.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 40</h6>
                                    <p x-html="item.content">Aucun travail souterrain, aucun sondage ne peut être pratiqué à l'intérieur du périmètre de protection sans autorisation préalable de l'autorité compétente.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 41</h6>
                                    <p x-html="item.content">Le déversement des eaux résiduaires dans le réseau d'assainissement public ne doit nuire ni à la gestion de ce réseau, ni à la conservation des eaux, des aménagements et ouvrages hydrauliques.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 42</h6>
                                    <p x-html="item.content">Les ressources en eau, les aménagements et ouvrages hydrauliques peuvent, dans un but d'intérêt général :<br>&nbsp;<br>- faire l'objet de mesures de classement ou de déclassement ;<br>- se voir reconnaître la qualité d'utilité publique.<br>&nbsp;<br>Un décret détermine les conditions et les modalités de classement, de déclassement et d'octroi du régime d'utilité publique.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 2 - DE LA PROTECTION DES EAUX</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 43</h6>
                                    <p x-html="item.content">La protection des ressources en eau est assurée aussi bien sur le plan quantitatif que qualitatif par l'institution de normes spécifiques.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 44</h6>
                                    <p x-html="item.content">Les eaux sacrées sont protégées par ceux auxquels la communauté en a conféré ce pouvoir et qui l'exercent dans l'intérêt de celle-ci sous le contrôle de l'Etat.<br>&nbsp;<br>Elles peuvent, si lintérêt le justifie, faire l'objet de mesures particulières de protection.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section première - Protection quantitative</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 45</h6>
                                    <p x-html="item.content">Tout gaspillage de l'eau est interdit.<br>&nbsp;<br>L'autorité peut, par voie réglementaire, déterminer les conditions à imposer aux particuliers, aux réseaux et installations publiques et privées afin d'éviter ce gaspillage.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 46</h6>
                                    <p x-html="item.content">Dans les parties du territoire national où les ressources en eau sont rares et/ou menacées, l'Administration est habilitée à édicter une réglementation plus stricte pour tenir compte de cette situation.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section 2 - Protection qualitative</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 47</h6>
                                    <p x-html="item.content">Les points de prélèvement des eaux, destinées à la consommation humaine doivent être entourés d'un périmètre de protection. Il est interdit dans ces périmètres de protection d'effectuer tout acte ou activité de nature polluante.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 48</h6>
                                    <p x-html="item.content">Les déversements, dépôts de déchets de toute nature ou deffluents radioactifs, susceptibles de provoquer ou d'accroître la pollution des ressources en eau sont interdits.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 49</h6>
                                    <p x-html="item.content">Tout rejet d'eaux usées dans le milieu récepteur doit respecter les normes en vigueur.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 50</h6>
                                    <p x-html="item.content">L'usage dexplosifs, de drogues, de produits toxiques comme appât dans les eaux de surface et susceptibles de nuire à la qualité du milieu aquatique est interdit.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 51</h6>
                                    <p x-html="item.content">Il est interdit de déverser dans la mer, les cours d'eau, les lacs, les lagunes, les étangs, les canaux, les eaux souterraines, sur leur rive et dans les nappes alluviales, toute matière usée, tout résidu fermentescible d'origine végétale ou animale, toute substance solide ou liquide, toxique ou inflammable susceptibles de constituer un danger ou une cause d'insalubrité, de provoquer un incendie ou une explosion.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 3 - DE LA PROTECTION DES AMENAGEMENTS ET OUVRAGES HYDRAULIQUES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 52</h6>
                                    <p x-html="item.content">Il est interdit, sauf cas de force majeure :<br>&nbsp;<br>- de dégrader, détruire ou enlever les aménagements et ouvrages hydrauliques ;<br>- d'endommager les ouvrages provisoires réalisés en vue de la construction ou de lentretien de ceux visés ci-dessus.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 53</h6>
                                    <p x-html="item.content">Les installations classées ou non, les aménagements ou ouvrages, sources de pollution, sont soumis à un audit écologique dans les conditions précisées par décret.<br>&nbsp;<br>Les résultats de l'audit écologique sont transmis à l'autorité compétente et communicables aux tiers.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 54</h6>
                                    <p x-html="item.content">Les aménagements et ouvrages hydrauliques présentant un intérêt national, dont la liste est déterminée par décret, font l'objet de mesures particulières de protection.<br>&nbsp;<br>A cette fin, l'autorité chargée de l'eau peut, en accord avec les ministères chargés de la Défense et de la Sécurité, faire assurer cette protection par les Forces publiques.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">TITRE IV - DE LA GESTION DES EAUX, DES AMENAGEMENTS ET OUVRAGES HYDRAULIQUES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE PREMIER - LE CADRE INSTITUTIONNEL</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 55</h6>
                                    <p x-html="item.content">La politique nationale de gestion des eaux, des aménagements et ouvrages hydrauliques est définie par décret pris en Conseil des ministres.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 56</h6>
                                    <p x-html="item.content">L'autorité chargée de l'eau assure la mise en uvre de cette politique.<br>&nbsp;<br>A ce titre, elle reçoit les déclarations et les demandes d'autorisation préalables relatives à lutilisation des ressources en eau, des aménagements et ouvrages hydrauliques.<br>&nbsp;<br>Elle exerce ses prérogatives conjointement, et selon les cas, avec les ministères compétents.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 57</h6>
                                    <p x-html="item.content">Un décret pris en Conseil des ministres définit les structures chargées de la gestion des ressources en eau fondée sur le principe de gestion par bassin versant hydrologique, et détermine les règles relatives à lorganisation, aux attributions et au fonctionnement de ces structures.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 58</h6>
                                    <p x-html="item.content">Aux termes de la présente loi, le cadre institutionnel repose sur un principe caractérisé par la distinction entre le gestionnaire et les différents utilisateurs de l'eau.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section première - Le rôle du gestionnaire</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 59</h6>
                                    <p x-html="item.content">L'Etat assure la gestion des ressources en eau en préservant la qualité des sources, en empêchant le gaspillage et en garantissant la disponibilité.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 60</h6>
                                    <p x-html="item.content">L'Etat garantit :<br>&nbsp;<br>- l'approvisionnement en eau potable ;<br>- la protection, la conservation et la gestion intégrée des ressources en eau ;<br>- la satisfaction des autres besoins ;<br>- l'Etat assure ;<br>- le développement et la protection des aménagements et ouvrages hydrauliques ;<br>- la prévention et la lutte contre les maladies hydriques.<br>&nbsp;<br>II exerce, par ses services compétents, la Police des eaux.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section 2 - Les droits et obligations des utilisateurs</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 61</h6>
                                    <p x-html="item.content">La reconnaissance des droits antérieurement acquis sur le domaine public hydraulique est faite à la diligence et par les soins de l'Administration ou à la demande des intéressés après enquête publique, dans les conditions qui sont déterminées par voie réglementaire.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 62</h6>
                                    <p x-html="item.content">Peuvent faire l'objet dune inscription au livre foncier les autorisations et les concessions de prélèvement d'eau, ainsi que les actes portant reconnaissance des droits acquis sur les eaux.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 63</h6>
                                    <p x-html="item.content">Les propriétaires dont les droits ont été régulièrement reconnus ne peuvent en être dépossédés que par voie d'expropriation. Cette mesure n'intervient que dans les conditions prévues par les lois et règlements en vigueur.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 64</h6>
                                    <p x-html="item.content">Toute personne qui a connaissance d'un incident ou d'un accident présentant un danger pour la sécurité civile, la qualité, la circulation ou la conservation des ressources en eau doit en informer, dans les meilleurs délais, l'autorité compétente.<br>&nbsp;<br>L'autorité compétente informe les populations par tous les moyens appropriés des circonstances de l'incident ou de l'accident, de ses effets et des mesures prises ou à prendre pour y remédier.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 65</h6>
                                    <p x-html="item.content">Toute personne à l'origine d'un incident ou d'un accident et tout exploitant ou, tout propriétaire sont tenus, selon les cas, dès qu'ils en ont connaissance, de prendre ou de faire prendre toutes les mesures possibles, pour faire cesser le danger ou l'atteinte au milieu. Ils doivent également prendre toutes les dispositions nécessaires pour y remédier.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 66</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 67</h6>
                                    <p x-html="item.content">En cas de carence ou s'il y a un risque de pollution ou de destruction du milieu naturel ou encore, pour la santé publique et l'alimentation en eau potable, l'autorité peut prendre ou faire exécuter les mesures nécessaires aux frais des personnes responsables.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 68</h6>
                                    <p x-html="item.content">Sans préjudice de l'indemnisation des victimes pour les autres dommages subis, les personnes intervenues matériellement ou financièrement ont droit au remboursement, par la ou les personnes à qui incombe la responsabilité de l'incident ou de l'accident, des frais exposés par elles. A cette fin elles peuvent saisir les Juridictions compétentes.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 69</h6>
                                    <p x-html="item.content">Les occupants d'un bassin versant ou les utilisateurs de l'eau peuvent se constituer en association pour la protection des ressources en eau et des ouvrages hydrauliques.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 2 - ORDRES DE PRIORITE</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 70</h6>
                                    <p x-html="item.content">L'alimentation en eau des populations demeure, dans tous les cas, l'élément prioritaire dans la répartition des ressources en eau.<br>&nbsp;<br>L'allocation des ressources en eau doit, à tout moment, tenir compte des besoins sociaux et économiques des populations.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 71</h6>
                                    <p x-html="item.content">Lorsqu'il a pu être satisfait aux besoins humains en eau, la répartition des ressources est effectuée en fonction des autres usages.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 72</h6>
                                    <p x-html="item.content">En cas de conflit pour la satisfaction de l'un ou l'autre des usages, autre que l'alimentation humaine, la répartition doit être faite par l'autorité compétente.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 73</h6>
                                    <p x-html="item.content">Des décrets, pris en Conseil des ministres, fixent les régimes et les conditions d'utilisation des eaux autres que celles destinées à l'alimentation humaine.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 74</h6>
                                    <p x-html="item.content">L'ordre de priorité peut être temporairement modifié lorsque surviennent certains événements exceptionnels tels que les cas de force majeure, de sécheresse et d'inondation.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 75</h6>
                                    <p x-html="item.content">L'autorité chargée de l'eau et les ministères compétents peuvent confier, à toute personne physique ou morale, le service public d'exploitation des eaux, des ouvrages et aménagements hydrauliques.<br>&nbsp;<br>Ces modes d'exploitation sont approuvés selon les cas par décret pris en Conseil des ministres.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 76</h6>
                                    <p x-html="item.content">Le contrat de concession peut conférer au bénéficiaire le droit:<br>&nbsp;<br>- d'établir, après approbation des projets par lautorité concédante, tous ouvrages utiles ;<br>- d'occuper les parties du domaine public nécessaires à ses installations.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 77</h6>
                                    <p x-html="item.content">Sans préjudice des clauses particulières figurant dans le contrat de concession, la déchéance du concessionnaire peut être prononcée pour :<br>&nbsp;<br>- utilisation des eaux différente de celle autorisée ou hors de la zone d'utilisation fixée ;<br>- non-paiement ou non-reversement des redevances ;<br>- non-respect des obligations à caractère Sanitaire, notamment dans le cas des sources thermales.<br>&nbsp;<br>En cas de déchéance du concessionnaire, lautorité chargée de l'eau et les ministères compétents peuvent ordonner la remise en l'état, le cas échéant, la faire effectuer d'office aux frais du concessionnaire déchu.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section première - Les eaux de consommation</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 78</h6>
                                    <p x-html="item.content">L'eau destinée à la consommation humaine doit être conforme aux normes de potabilité fixées par arrêté conjoint de l'autorité chargée de l'eau et du ministre chargé de la Santé.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 79</h6>
                                    <p x-html="item.content">Quiconque offre au public de l'eau en vue de l'alimentation humaine, à titre onéreux ou à titre gratuit et sous quelque forme que ce soit y compris la glace alimentaire, est tenu de s'assurer que cette eau est potable et conforme aux normes en vigueur.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 80</h6>
                                    <p x-html="item.content">Lutilisation d'eau pour la préparation et la consommation de toute denrée et marchandise destinées à l'alimentation tant humaine qu'animale doit répondre aux normes d'hygiène et de santé publique.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 81</h6>
                                    <p x-html="item.content">Dans les zones pourvues d'un service de distribution publique d'eau, il est interdit aux personnes physiques ou morales et notamment aux restaurateurs, hôteliers de livrer pour l'alimentation et pour tous les usages ayant un rapport avec l'alimentation, toute eau autre que l'eau potable fournie par les services précités.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 82</h6>
                                    <p x-html="item.content">L'usage des puits et des sources privés n'est autorisé pour l'alimentation humaine que si l'eau en provenant est potable, et si toutes les précautions sont prises pour mettre cette eau à l'abri de toutes contaminations dues, notamment à la proximité de latrines, dépôts de fumiers, d'ordures, d'immondices et de cimetières.<br>&nbsp;<br>L'eau de ces puits doit présenter constamment les qualités de potabilité requises par la réglementation et les normes en vigueur.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 83</h6>
                                    <p x-html="item.content">En milieu desservi par un réseau d'adduction d'eau potable, l'usage des eaux de puits pour la consommation humaine peut être interdit.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 84</h6>
                                    <p x-html="item.content">Toute méthode de correction des eaux ou tout recours à un mode de traitement de ces eaux à l'aide d'additifs chimiques, doit être au préalable autorisé dans les conditions fixées par voie réglementaire. Les additifs éventuels ne doivent en aucun cas nuire à la potabilité de l'eau et en altérer les propriétés organoleptiques.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 85</h6>
                                    <p x-html="item.content">Les mesures destinées à prévenir la pollution des eaux de consommation sont prescrites par arrêté conjoint de l'autorité chargée de l'eau et des ministères compétents.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section 2 - Les eaux minérales</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 86</h6>
                                    <p x-html="item.content">La surveillance et le contrôle des opérations d'installation ayant trait à la conservation, à l'aménagement des eaux minérales, des eaux de source et eaux de table et même à leur conditionnement est exercée par les services compétents.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 87</h6>
                                    <p x-html="item.content">Les sources d'eaux telles qu'énoncées à l'article 86 ci-dessus peuvent être déclarées d'intérêt public par décret pris en Conseil des ministres.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 88</h6>
                                    <p x-html="item.content">L'exportation, limportation, et la commercialisation des eaux minérales naturelles et des eaux de table sont soumises à une autorisation préalable délivrée conjointement par l'autorité chargée de l'eau et les ministères compétents.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section 3 - Les eaux utilisées à des fins agro-pastorales, industrielles et pour la satisfaction d'autres besoins</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 89</h6>
                                    <p x-html="item.content">L'utilisation des eaux à des fins agro-pastorales, industrielles et pour la satisfaction d'autres besoins notamment la pêche, les loisirs et les transports nécessite des servitudes et doit respecter les textes et normes en vigueur ainsi que les impératifs visés par la présente loi portant Code de l'Eau.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 3 - LA PLANIFICATION ET LA COOPERATION</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 90</h6>
                                    <p x-html="item.content">Aux termes de la présente loi portant Code de lEau, il est prévu:<br>&nbsp;<br>- l'inventaire des ressources en eau, des aménagements et ouvrages hydrauliques ;<br>- le développement d'un réseau national de collecte de données relatives aux ressources en eau, aux aménagements et ouvrages hydrauliques ;<br>- la fixation ou l'institution des objectifs de qualité des eaux ;<br>- les Schémas directeurs d'Aménagement et de Gestion des Ressources en Eau (SDAGRE) ;<br>- l'institution de systèmes, de zones et de plan d'alerte.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 91</h6>
                                    <p x-html="item.content">Il est réalisé, selon une périodicité à déterminer par décret, un inventaire des ressources en eau, des aménagements et ouvrages hydrauliques.<br>&nbsp;<br>Cet inventaire est établi sous la direction de lautorité chargée de l'eau en collaboration avec les ministères compétents et les différents utilisateurs.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 92</h6>
                                    <p x-html="item.content">L'inventaire des ressources en eau, des aménagements et ouvrages hydrauliques doit déboucher sur l'élaboration d'un plan d'action à court, moyen et long terme.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 93</h6>
                                    <p x-html="item.content">Les données et informations collectées et élaborées par les structures de gestion des eaux doivent être communiquées à l'autorité chargée de leau.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 94</h6>
                                    <p x-html="item.content">Les Schémas directeurs d'Aménagement et de Gestion des Ressources en Eau (SDAGRE) sont réalisés par bassin versant ou groupe de bassins versants hydrologiques.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 95</h6>
                                    <p x-html="item.content">Les Schémas directeurs d'Aménagement et de Gestion des Ressources en Eau (SDAGRE) fixent pour chaque bassin versant ou groupe de bassins versants, les orientations globales de la gestion intégrée des ressources en eau.<br>&nbsp;<br>Ils définissent les objectifs de qualité et de quantité des eaux, des écosystèmes aquatiques et des zones humides ainsi que les aménagements et ouvrages hydrauliques à réaliser.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 96</h6>
                                    <p x-html="item.content">Le projet des Schémas directeurs dAménagement et de Gestion des Ressources en Eau (SDAGRE) est élaboré, par lautorité nationale chargée de l'eau.<br>&nbsp;<br>Après Enquête publique, il est soumis pour avis au Comité de Bassin comprenant, notamment, des représentants de l'Etat, des Organisations non gouvernementales (ONG), délus locaux, dusagers, dexploitants, de spécialistes en la matière.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 97</h6>
                                    <p x-html="item.content">Les schéma directeurs dAménagement et de Gestion des ressources en Eau (SDAGRE); sont complétés par des Plans Directeurs dAménagement et de développement des Ouvrages Hydrauliques (PDADOH).</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 98</h6>
                                    <p x-html="item.content">En cas de sécheresse ou d'accident susceptible de provoquer une pénurie deau ou une inondation, les autorités compétentes sont habilitées à prendre toutes mesures des stockages ou de prélèvement des eaux.<br>&nbsp;<br>Dans ces cas, il peut être institué une zone dalerte fixant les mesures à prendre et les usages de l'eau de première nécessité.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 99</h6>
                                    <p x-html="item.content">L'Etat prend les mesures nécessaires pour favoriser la coopération dans le cadre de la gestion et la mise en valeur des ressources en eau en partage avec les Etats voisins.<br>&nbsp;<br>Cette coopération vise à assurer :<br>&nbsp;<br>- l'échange d'informations sur toutes les situations, notamment les situations critiques ;<br>- la mise en place des projets conjoints et de structures bilatérales et multilatérales de gestion des eaux ;<br>- la gestion intégrée des ressources en eau en partage.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 4 - LES MECANISMES FINANCIERS</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section première - Les redevances et les primes</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 100</h6>
                                    <p x-html="item.content">Toute personne physique ou morale utilisant les eaux du domaine public hydraulique est soumise au paiement d'une redevance, dans les conditions fixées par la présente loi portant Code de l'Eau et ses textes d'application.<br>&nbsp;<br>LEtat fixe les redevances.<br>&nbsp;<br>Il peut allouer des primes pour toutes les activités tendant à une meilleure exploitation des eaux, des aménagements et ouvrages hydrauliques.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 101</h6>
                                    <p x-html="item.content">Les redevances telles que prévues à l'article visé ci-dessus sont :<br>- redevance relative à la qualité ;<br>- redevance relative à la quantité prélevée ;<br>- redevance relative à l'utilisation de la force motrice de l'eau ;<br>- redevance relative à l'utilisation de l'eau ;<br>- redevance relative à la mobilisation des ressources en eau.<br>&nbsp;<br>L'autorité compétente peut définir, en tant que de besoin, d'autres types de redevances.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 102</h6>
                                    <p x-html="item.content">L'assiette, le taux et le mode de recouvrement des redevances sont fixés conformément à la législation en vigueur.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 103</h6>
                                    <p x-html="item.content">Les modes de concession tels que visés à l'article 75 ci-dessus, donnent lieu, selon les cas, à perception de redevances.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 104</h6>
                                    <p x-html="item.content">Les Conditions dallocation des primes sont fixées par voie réglementaire.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">Section 2 - Le Fonds de Gestion des Ressources en Eau des Aménagements et Ouvrages hydrauliques.</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 105</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 106</h6>
                                    <p x-html="item.content">Le fonds de Gestion des Ressources en Eau, des Aménagements et Ouvrages hydrauliques est alimenté par :<br>&nbsp;<br>- les subventions de lEtat ;<br>- les redevances ;<br>- les produits des transactions ;<br>- les autres libéralités.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">TITRE v - POLICE DES EAUX, INFRACTIONS ET SANCTIONS</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE PREMIER - DE LA CONSTATATION DES INFRACTIONS</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 107</h6>
                                    <p x-html="item.content">Sont chargés de constater les infractions aux dispositions de la présente loi portant Code de lEau et des textes pris pour son application, den rassembler les preuves et d'en rechercher les auteurs :<br>&nbsp;<br>- les officiers et les agents de Police judiciaire ;<br>- les fonctionnaires et agents des différents services compétents.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 108</h6>
                                    <p x-html="item.content">Les fonctionnaires et agents visés à larticle ci-dessus prêtent serment devant le tribunal de première instance ou la section du tribunal de la circonscription administrative.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 109</h6>
                                    <p x-html="item.content">En vue de rechercher et de constater les infractions, les fonctionnaires et agents assermentés ont accès aux locaux, aux installations et aux lieux où sont réalisés les opérations à l'origine des infractions. Les propriétaires et exploitants sont tenus de leur livrer passage.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 110</h6>
                                    <p x-html="item.content">Dans l'exercice de leurs fonctions, les fonctionnaires et agents assermentés peuvent requérir l'assistance de la force publique.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 111</h6>
                                    <p x-html="item.content">Les infractions aux dispositions de la présente loi portant Code de l'Eau et des textes pris pour son application sont constatées par des procès-verbaux qui font foi jusquà preuve contraire.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 112</h6>
                                    <p x-html="item.content">Le procès-verbal de constatation comporte, notamment, l'identité du contrevenant, les circonstances et le lieu de l'infraction, les explications de lauteur présumé et les éléments faisant ressortir la matérialité des infractions.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 113</h6>
                                    <p x-html="item.content">Certaines infractions, dont la liste est déterminée par décret, peuvent donner lieu à des transactions. Celles-ci sont effectuées par lautorité chargée de l'eau en liaison avec les ministères compétents.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 114</h6>
                                    <p x-html="item.content">En cas déchec de la transaction ou pour les infractions graves dont la liste est établie par décret, les procès-verbaux doivent être adressés dans les quinze jours francs qui suivent le constat au Procureur de la République ou au juge de la section de tribunal compétent.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">CHAPITRE 2 - DES SANCTIONS</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 115</h6>
                                    <p x-html="item.content">En cas dinfraction flagrant aux dispositions prévues par la présente loi portant Code de l'Eau, les fonctionnaires et agents assermentés doivent faire arrêter les travaux et confisquer les objets ayant servi à commettre l'infraction.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 116</h6>
                                    <p x-html="item.content">Tout propriétaire de fonds supérieur qui par des travaux, des aménagements particuliers ; aggrave la servitude d'écoulement des eaux est puni d'une peine d'emprisonnement de six jours à deux mois et d'une amende de 50.000 à 300.000 francs ou de l'une de ces deux peines seulement.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 117</h6>
                                    <p x-html="item.content">Quiconque prélève des eaux du domaine public, en quantité excessive, sans autorisation ou déclaration préalable est passible d'un emprisonnement de deux à six mois et d'une amende de 360.000 francs à 5.000.000 de francs ou de l'une de ces deux peines seulement.<br>&nbsp;<br>En cas de récidive, la peine sera portée au double.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 118</h6>
                                    <p x-html="item.content">Est puni d'une peine d'emprisonnement de deux mois à deux ans et d'une amende de 1.000.000 à 5.000.000 de francs ou de l'une de ces deux peines quiconque :<br>&nbsp;<br>- poursuit une opération ou l'exploitation d'une installation ou d'un ouvrage sans se conformer à l'arrêté de mise en demeure, au terme d'un délai fixé par les prescriptions techniques contenues dans l'autorisation ou les règlements pris en application de la présente loi portant Code de l'Eau ;<br>- exploite une installation ou réalise des travaux en violation d'une mesure de mise hors service, de retrait ou de suspension d'une autorisation ou de suppression d'une installation ou d'une mesure d'interdiction prononcée en application de la présente loi portant Code de lEau.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 119</h6>
                                    <p x-html="item.content">Quiconque entreprend un travail souterrain ou un sondage dans le périmètre de protection sans autorisation préalable est passible d'une peine d'emprisonnement d'un mois à six mois et d'une amende de 500.000. francs à 10.000.000 de francs ou de l'une de ces deux peines seulement.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 120</h6>
                                    <p x-html="item.content">Tout gaspillage de l'eau est passible d'une peine demprisonnement d'un mois à six mois et d'une amende de 360.000 francs à 10.000.000 de francs ou de l'une de ces deux peines Seulement.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 121</h6>
                                    <p x-html="item.content">Quiconque se livre à une activité susceptible de dégrader la qualité des eaux, des aménagements et ouvrages hydrauliques est passible d'une peine d'emprisonnement de six mois à deux ans et d'une amende de 1.000.000 à 100.000.000 de francs ou de l'une de ces deux peines seulement.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 122</h6>
                                    <p x-html="item.content">Quiconque jette, déverse ou laisse s'écouler dans les eaux de surface, les eaux souterraines ou les eaux de la mer dans les limites des eaux territoriales, directement ou indirectement, tous déchets ou substances, dont l'action ou les réactions ont même provisoirement entraîné des effets nuisibles sur la santé ou des dommages à la flore ou à la faune ou des modifications significatives, du régime normal découlement des eaux, est puni dun emprisonnement de deux mois à deux ans et dune amende de 2.000.000 à 100.000.000 de francs ou de lune de ces deux peines seulement.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 123</h6>
                                    <p x-html="item.content">Quiconque use d'explosifs, de drogues de produits toxiques dans les eaux de surface comme appât et susceptibles de nuire à la qualité du milieu aquatique, est passible d'une peine d'emprisonnement de deux à six mois et d'une amende de 360.000 francs à 1.000.000 de francs ou de l'une de ces deux peines seulement.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 124</h6>
                                    <p x-html="item.content">Quiconque endommage les aménagements ou les ouvrages hydrauliques par quelque moyen que ce soit, est passible d'un emprisonnement de deux mois à deux ans et d'une amende de 500.000 francs à 100.000.000 de francs ou de l'une de ces deux peines seulement.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 125</h6>
                                    <p x-html="item.content">Quiconque use des eaux de puits pour la consommation humaine en milieu desservi par un réseau d'adduction d'eau potable en cas d'interdiction est passible d'une peine d'emprisonnement de six jours à un mois et d'une amende de 50.000 francs à 300.000 francs ou l'une de ces deux peines seulement.<br>&nbsp;<br>Le juge peut ordonner la destruction du puits.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 126</h6>
                                    <p x-html="item.content">Quiconque importe, exporte ou commercialise, les eaux minérales ou de table non conformes aux normes en vigueur est passible d'une peine d'emprisonnement de deux mois à un an et d'une amende de 500.000 francs à 10.000.000 de francs ou de l'une de ces deux peines seulement.<br>&nbsp;<br>Le juge peut ordonner la confiscation et la destruction de ces produits.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 127</h6>
                                    <p x-html="item.content">Quiconque offre au public de l'eau en vue de l'alimentation humaine ou animale, à titre gratuit ou onéreux et sous quelque forme que ce soit non conforme aux normes d'hygiène et de santé publique, est passible d'une peine d'emprisonnement de deux mois à deux ans et dune amende de 360.000 francs à 2.000.000 de francs ou de l'une de ces deux peines seulement.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">TITRE VI - DISPOSITIONS TRANSITOIRES ET DIVERSES</h6>
                                    <p x-html="item.content"></p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 128</h6>
                                    <p x-html="item.content">Les ouvrages existants doivent être mis en conformité dans un délai de deux ans à compter de l'entrée en vigueur de la présente loi portant Code de l'Eau.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 129</h6>
                                    <p x-html="item.content">Sous réserve de l'élaboration des normes, telles que prévues dans la présente loi portant Code de l'Eau, les normes en vigueur sont celles de l'Organisation mondiale de la Santé (OMS).</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 130</h6>
                                    <p x-html="item.content">Les forages industriels sont soumis aux dispositions de la loi n° 95-533 du 18 juillet 1995 portant Code minier. Il en est de même pour les sondages et les ouvrages souterrains.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 131</h6>
                                    <p x-html="item.content">Les dispositions des articles 117, 118 et 133 du Code pénal relatives aux circonstances atténuantes et au sursis ne sont pas applicables aux infractions prévues par les articles 121, 122, 123, 124, 125 et 126 de la présente loi portant Code de l'Eau.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 132</h6>
                                    <p x-html="item.content">Les modalités d'application de la présente loi portant Code de lEau seront déterminées par décrets pris en Conseil des ministres.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 133</h6>
                                    <p x-html="item.content">La présente loi portant Code de l'Eau abroge toutes les dispositions antérieures contraires.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div><div>
                            <template x-if="item.ancestors.length == 0 &amp;&amp; item.children.length == 0">
                                <div>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template><div>
                                    <h6 class="title_sommaire" x-text="item.name">ARTICLE 134</h6>
                                    <p x-html="item.content">La présente loi sera publiée au Journal officiel de la République de Côte d'Ivoire et exécutée comme loi de l'Etat.</p>
                                </div>
                            <template x-if="item.ancestors.length > 0 || item.children.length > 0">
                                <div>
                                    <button class="btn btn-outline-primary btn-sm pdf-button float-right" x-on:click="showEvolution('')">
                                        Textes modifiés
                                    </button>
                                    <h6 class="title_sommaire" x-text="item.name"></h6>
                                    <p x-html="item.content"></p>
                                </div>
                            </template>
                        </div>
            </div>`;

// Appeler la fonction avec le contenu HTML exemple
generateWordFromHtml(exampleOuterHTML);
