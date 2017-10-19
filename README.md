# React

## Les éléments React et le JSX

```jsx
const element = <h1>Hello, world!</h1>;
```

Le JSX est un moyen commode pour le dévelopeur de __décrire__ à quoi doit ressembler l'UI et produit des "éléments" React. Ce n'est ni du HTML ni du Javascript, et il est "compilé" en javascript pur.
On peut donc inclure des expressions JS dans le JSX :

```jsx
<div className="profile">
  <img src={user.profilePicture} />
  <span>
    {upperCaseFirstLetter(user.name)}
  </span>
</h1>
```

Les éléments React sont des __objects JS__. Ils sont moins couteux à manipuler qu'un élement du DOM. React s'occupe de mettre a jour le DOM pour correspondre à la description faite par les éléments.

L'enchainement de tous les éléments React correspond à ce qu'on appelle le "Virtual DOM". Lorsque la description change, React compare la nouvelle description à l'ancienne et opère les changements nécessaires uniquement.

__Avec le JSX, on décrit à quoi doit ressembler l'interface utilisateur (UI) à tout instant.__


## Les composants et les props

Les composants sont le coeur de React. Ils permettent de __découper l'interface__ en morceaux indépendents, isolés et réutilisables.

Les composants recoivent des __propriétés__ (regroupées sous l'object `props`) et les utlisent pour retourner les éléments React qui doivent s'afficher a l'écran grâce à la méthode `render()`. Dans l'exemple ci-dessous, le composant accepte une propriété `name` pour souhaiter la bienvenue à un utilisateur :

```jsx
// Déclaration du composant
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Utilisation du composant
const element = <Welcome name="Toto" />
```

On voit ici que le composant `Welcome` est lui aussi rendu sous forme d'élément React.  
Les noms des composants doivent toujours commencer par une __majuscule__, les noms en minuscule étant réservés aux éléments du DOM.

```jsx
const domElt = <div />;
const customElt = <Welcome />;
```

Les composants peuvent ensuite être __composés__ pour former une UI plus complexe.

```jsx
<Profile>
  <ProfilePicture src={user.picture} circle={true} />
  <ProfileContent>
    <ProfileName
      first={user.firstName}
      last={user.lastName}
    />
    <Birth>
      <Date>
        {user.birth.date}
      </Date>
      <Location lat={user.birth.lat} lon={user.birth.lon} />
    </Birth>
  </ProfileContent>
</Profile>
```

__Les props d'un composant sont immutables__, c'est à dire qu'elles ne peuvent ni ne doivent jamais être modifiées.

## Le state des composants

Puisque les props d'un composant ne peuvent jamais être modifiées, React fournit un autre moyen de mettre à jour un composant : l'object `state`.

Le `state` est un object similaire à l'objet `props`, mais il est privé et totalement géré par le composant lui même. (à l'inverse des `props` qui sont injectées au composant depuis l'extérieur)
Le `state` doit être déclaré dans le constructeur du composant.

```jsx

// Ce composant affiche un nombre aléatoire entre 1 et 10.
class Random extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      number: Math.floor(Math.random() * 10) + 1,
    }
  }

  render() {
    return (
      <span>
        {this.state.number}
      </span>
    )
  }

}
```
_NOTE: Il vaut mieux toujours appeler le constructeur parent avec les props en paramètres._

## Cycle de vie des composants

Le composant `Random` doit maintenant se mettre à jour toutes les secondes. Comme c'est une caractéristique du composant, nous ne voulons pas gérer la mise à jour manuellement depuis l'extérieur, mais plutot rendre le composant autonome. C'est ici que le `state` devient intéressant.

L'API de React expose des méthodes qui seront appelées automatiquement au cours de la vie du composant. Le développeur peut s'en servir de manière à gérer les ressources qui ne sont pas propres à React par exemple (appel à une base de données, vider un cache, etc...)

Ici, nous voulons créer un <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout" target="_blank">timer</a> lorsque le composant est rendu pour la première fois. (On dit lorqu'il est _"monté"_) et le supprimer lorsque le composant sera _démonté_.

```jsx

class Random extends React.Component {

  constructor(props) {
    ...
  }

  componentDidMount() {
    this.timer = setTimeout(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    ...
  }

}
```
_NOTE: Ici le timer est enregistré sous l'object `this`, qui fait référence au composant lui même. React ajoute automatiquement l'objet `props` à `this`, et la clé `state` est reservée, mais en dehaors de ces deux mots clés nous sommes tout à fait libres d'ajouter à `this` autant de champs que nécessaires._

Il faut maintenant implémenter la méthod tick du composant qui sera chargée de mettre à jour le `state`.

```js

class Random extends React.Component {

  constructor(props) { ... }

  componentDidMount() { ... }

  componentWillUnmount() { ... }

  tick() {
    this.setState({
      number: Math.floor(Math.random() * 10) + 1,
    });
  }
  render() {
    ...
  }

}
```

La méthode `tick` est executée toutes les secondes grâce au timer que l'on a créé en montant le composant.
Elle met à jour l'état du composant avec `setState()`. Lorsque l'état est modifié, la méthode `render()` est appelée automatiquement par React, et le DOM se met a jour.

__ Il faut toujours modifier le state avec un appel à `setState()`.__ Muter le state directement ne re-rendra pas le composant.
```js
this.state.number = Math.floor(Math.random() * 10) + 1; // doesn't work

this.setState({
  number: Math.floor(Math.random() * 10) + 1,
}); // works !
```

`setState` fusionne l'état existant avec le nouveau.
```js
this.state = {
  post: "React c'est bien.",
  comments: [],
}

this.setState({
  comments: ['👍'],
})

// Le state est maintenant :
{
  post: "React c'est bien.",
  comments: ['👍'],
}
```


## Les données vont de haut en bas

React utilise un flux de données uni-directionnel, du parent vers les enfants.

Un composant parent peut injecter des données à ses enfants via les props. Il peut lui passer des données arbitaires, ré-injecter toutes (ou une partie) de ses `props`, et / ou injecter tout son state (ou une partie). Un moyen commode est d'utiliser l'opérateur desctructeur ES6 (`{...object}`).

```jsx
class Parent extends React.Component {

  ...

  render() {
    <div>
      <Child arbitraryProp="42" />
      <Child {...this.props} />
      <Child requiredProp={this.props.required} />
      <Child {...this.state} />
      <Child {...this.props} {...this.state} />
    </div>
  }
}
```

Pour remonter des données des enfants vers le parent, on utilisera générlement les evenements

## Events

## Forms
- Convertiseur de devise

### Lists

### JSX advanced

- TODO list

... wip













###



### Tools :

#### Atom extensions:

##### Syntax highlighting
  - language-babel
  - language-ini
  - language-env

##### Linting
  - linter
  - linter-eslint
  - linter-flow
  - linter-stylelint

##### Snippet generation
  - dockblockr
  - emmet

#### Miscellaneous
  - color-picker: open it `CMD-SHIFT-C`
  - highlight-selected
  - minimap : A preview of the full source code
  - minimap-highlight-selected
  - file-icons : Assign file extension icons and colors for improved visual grepping
