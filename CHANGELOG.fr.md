# Journal des modifications

## 0.6.1 · 2026-11-26

- Quand « Lancer un agent » échoue depuis une carte du tableau du sprint, l’erreur s’affiche au-dessus du tableau au lieu de rien

## 0.6.0 · 2026-11-25

- Le sprint en cours affiche tous ses tickets, plus seulement les 500 premiers
- Un projet lié que votre compte Jira ne voit pas affiche un badge « pas d’accès » et un avertissement, avec un moyen de choisir d’autres projets
- Les agents qui cherchent dans Jira obtiennent jusqu’à 200 tickets par site, et sont prévenus quand il y en a d’autres
- Le tableau vide n’affiche plus « false » sous son message

## 0.5.0 · 2026-11-24

- Dès qu’un ticket a des agents, Lancer un agent devient Agent ▾ : lancez un nouvel agent ou reprenez un agent du ticket, et survolez-le pour voir son état, sa branche et quand il a été lancé
- Demande Squadron 0.52.0 et l’accès à vos agents pour les afficher

## 0.4.2 · 2026-11-20

- Le sprint en cours affiche les tickets des projets dont la clé est un mot réservé du JQL, comme MAX

## 0.4.1 · 2026-11-19

- Les filtres du panneau restent tels que vous les avez réglés quand vous changez de conversation ou rouvrez le panneau

## 0.4.0 · 2026-11-16

- Testez la connexion avant d’enregistrer un site Jira, et voyez dans la liste si chacun marche : connecté en tant que qui et combien de projets, ou pourquoi il échoue
- Les barres de défilement du panneau prennent leur propre place au lieu de couvrir les compteurs des filtres

## 0.3.0 · 2026-11-16

- Le tableau et la liste suivent les colonnes de votre board Jira, dans son ordre, avec les statuts que chaque colonne regroupe
- Glissez l’en-tête d’une colonne pour la déplacer ; Ordre de Jira les remet en place
- Les filtres à gauche du tableau se replient et reviennent avec le bouton à côté de la recherche
- Lancer un agent, sur une carte, est un bouton à contour avec une étincelle, plus une flèche

## 0.2.0 · 2026-11-16

- Le logo Jira sur l’extension et sur le bouton Jira de chaque agent
- Tableau : le sprint en cours en une colonne par statut, avec des filtres par projet, assigné, statut, type, priorité et epic
- Lancer un agent ouvre la fenêtre Nouvel agent remplie par Haiku à partir du ticket, avec les champs qu’il lit à cocher ou décocher
- Le ticket montre ses champs à côté de sa description quand le panneau est large, et ses commentaires se cherchent et se trient

## 0.1.1 · 2026-11-16

- Le champ du jeton d’API mène à la page Atlassian qui le crée, et indique de prendre le jeton sans portées

## 0.1.0 · 2026-11-13

- Le sprint en cours des projets Jira d’un projet Squadron, dans un panneau à côté de l’agent
- Un ticket va dans votre message, ou Haiku en fait une consigne
- Les pièces jointes s’ouvrent dans leur application
- Les agents disposent de jira_ticket, jira_sprint et jira_search
