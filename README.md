# React

## Les éléments React et le JSX

```jsx
const element = <h1>Hello, world!</h1>;
```

Le JSX est un moyen commode pour le dévelopeur de __décrire__ à quoi doit ressembler l'interface utilisateur (UI).  
Il produit des "éléments" React. Ce n'est ni du HTML ni du Javascript, et il est "compilé" en javascript pur.
On peut donc inclure des <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions" target="_blank">__expressions javascript__</a> dans le JSX en les placant entre des accolades :

```jsx
<div className="profile">
  <img src={user.profilePicture} />
  <span>
    {upperCaseFirstLetter(user.name)}
  </span>
</div>
```

Les éléments React sont des __objets JavaScript__. Ils sont moins couteux à manipuler qu'un noeud du DOM. React s'occupe de mettre a jour le DOM pour correspondre à la description faite par les éléments.

L'enchainement de tous les éléments correspond à ce qu'on appelle le "Virtual DOM". Lorsque la description change, React compare la nouvelle description à l'ancienne et opère uniquement les changements nécessaires.

__Avec le JSX, on décrit à quoi doit ressembler l'interface utilisateur (UI) à tout instant.__ React s'occupe automatiquement de faire correspondre l'interface à notre description.


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

__Les props d'un composant sont immutables__, c'est à dire qu'elles ne peuvent pas être modifiées par le composant lui-même.

```jsx
...
// THIS WILL THROW AN ERROR
render() {
  this.props.number = 42;
  return (
    <div>{ this.props.number }</div>
  )
}
...
```


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

```js

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
_NOTE: Ici le timer est enregistré sous l'objet `this`, qui fait référence au composant lui même. React ajoute automatiquement l'objet `props` à `this`, et la clé `state` est reservée, mais en dehors de ces deux mots clés nous sommes tout à fait libres d'ajouter à `this` autant de champs que nécessaires._

Il faut maintenant implémenter la méthod `tick()` du composant qui sera chargée de mettre à jour le `state`.

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

Un composant parent peut __injecter des données à ses enfants via les props__. Il peut lui passer des données arbitaires, ré-injecter toutes (ou une partie) de ses `props`, et / ou injecter tout son `state` (ou une partie). Un moyen commode est d'utiliser l'opérateur desctructeur ES6 (`{...object}`).

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

Savoir si un


### Liste d'éléments

Il est possible de rendre des collections d'éléments dans le JSX, en itérant sur un tableau avec la méthode <a href="https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/map" target="_blank">`map()`</a>

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <div>{number}</div>
);
```

Pour aider React à gérer les changements dans la liste (ex : mise à jour / ajout / suppression d'un item de la liste ), il faut donner à chaque élément une __clé unique__ via une `prop` spéciale : `key`.

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Généralement, les données que l'on affiche dans une liste proviennent d'une base de données et disposent donc d'un identifiant unique que l'on utilisera en tant que `key`. S'il n'est pas possible d'identifier l'élément de manière unique, on peut éventuellement utiliser l'index courant de l'itération (le second paramètre de la méthode `map`). Cependant, cela ne fonctionnera pas correctement si la liste peut être ré-ordonnée.

```jsx
const todoItems = todos.map((todo, index) =>
  <li key={index}>
    {todo.text}
  </li>
);
```

React re-rendra l'intégralité de la liste si `key` n'est pas fournie ou pas unique, ce qui peut causer des problèmes de performances.

*__NOTE__: La prop `key` est automatiquement supprimée par React lorsqu'il rend le composant, et n'est donc pas accessible à l'interieur de ce dernier. S'il y a besoin de récupérer l'identifiant unique, il faut passer une prop supplémentaire.*

```jsx

// This doesn't work as expected

class TodoItem extends Component {
  render() {
    return (
      <div>
        <span>{ this.props.key }</span> // undefined
        <span>{ this.props.text }</span>
      </div>
    )
  }
}

class TodoList extends Component {
  render() {
    return (
      <div>
      {todos.map((todo, index) =>
        <TodoItem
          key={todo.id}
          text={todo.text}
        />
      )}
      </div>
    )
  }
}

// This works !

class TodoItem extends Component {
  render() {
    return (
      <div>
        <span>{ this.props.id }</span>
        <span>{ this.props.text }</span>
      </div>
    )
  }
}

class TodoList extends Component {
  render() {
    return (
      <div>
      {todos.map((todo, index) =>
        <TodoItem
          key={todo.id}
          id={todo.id} // passing a dedicated prop
          text={todo.text}
        />
      )}
      </div>
    )
  }
}
```

*__NOTE 2__: La prop `key` n'a de sens que dans l'itération du tableau.*

```jsx

// This doesn't work as expected

class TodoItem extends Component {
  render() {
    return (
      <div key={this.props.id}> // inutile
        <span>{ this.props.text }</span>
      </div>
    )
  }
}

class TodoList extends Component {
  render() {
    return (
      <div>
      {todos.map((todo, index) =>
        <TodoItem text={todo.text} /> // la prop key doit être déclarée ici.
      )}
      </div>
    )
  }
}
```

## Events

Pour gérer des évenements sur les éléments du JSX, on connecte des fonctions à des `props` spéciales.
```jsx
<button onClick={() => { console.log('Clicked !') }}>Click me !</button>
```
*A la différence du HTML qui gère ces évènements en lowercase, on écrit les props en camelCase. (onclick =/= onClick)*

Généralement, on passe une méthode du composant pour gérer l'évènement. React passera automatiquement un objet <a href="https://reactjs.org/docs/events.html" target="_blank">__évènement__ (SyntheticEvent)</a> en paramètre.
```jsx
class Button extends Component {

  handleClick(event) {
    console.log('Clicked !', event);
  }

  render() {
    return (
      <button onClick={this.handleClick}>Click me !</button>
    );
  }
}

```

En JavaScript, les méthodes d'une classe ne sont pas __liées__ automatiquement. Cela signifie que le contexte d'execution (le mo clé `this`) est perdu si la méthode est appelée de manière asynchrone. Considérant le code ci dessus :
```jsx
class Button extends Component {

  handleClick(event) {
    console.log(this); // undefined
  }

  ...
}
```
Il faut donc lier la méthode au composant "à la main". Il y a plusieurs facon de faire cela :

- Dans la méthode `render`:
```jsx
...
render() {
  return (
    <button onClick={this.handleClick.bind(this)}>Click me !</button>
    // OU
    <button onClick={(event) => this.handleClick(event)}>Click me !</button>
  );
}
```
Le problème de cette façon de faire est qu'une nouvelle fonction est créée à chaque appel de `render`, ce qui peut causer des problèmes de performances en re-rendant tous les composants enfants à chaque fois. En génral, on évitera donc d'utiliser cette méthode.

- Dans le `constructor`:
```jsx
class Button extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  ...
}
```
Le problème de cette façon de faire est qu'il est possible d'oublier de lier la méthode :) De plus cela "pollue" le constructeur avec du code qui n'est pas intéressant à lire.

- Avec la syntaxe ES7 qui lie automatiquement la méthode:
```jsx
class Button extends Component {

  handleClick = (event) => {
    console.log(this); // Button
  }
}
```
Cette syntaxe est encore expérimentale, et peut ne pas fonctionner suivant la configuration du compileur.


## Forms
Les formulaires sont une part essentielle des applications web. Les éléments de formulaires sont un peu différents des autres éléments du fait qu'il possèdent un état intrinsèque. C'est le navigateur qui maintient l'état interne du fomulaire, et extrait toutes les valeurs des champs à la soumission. Or jusqu'ici, nous avons vu que c'est React qui doit gérer l'état des éléments de façon à les rendre de façon optimale. Il y a donc un conflit entre le navigateur et React, qu'il appartient au développeur de trancher.

Par défaut, si on ne faire rien, le code suivant rend un input html fonctionnel.
```jsx
class Input extends Component {
  render() {
    return <input type="text" />;
  }  
}
```
Cependant, le composant est rendu __une seule fois__, et quand on écrit dans le champ, c'est le navigateur qui gère l'état du `input`. React n'est pas au courant que quelque chose à changé.

Pour rendre le contrôle du `input` à React, il y a un peu de travail. Le composant doit avoir un `state` qui sera mis à jour à chaque changement du `input`.
```jsx
class Input extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''; // etat initial
    }
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  }

  render() {
    return (
      <input
        type="text"
        value={this.state.value}
        onChange={this.handleChange}
        />
    );
  }  
}
```
Maintenant, React à le contrôle sur l'état (`state`) du composant qui devient __la seule source de vérité__. Cela rend très facile la modification ou la validation des données saisies. Par exemple, pour forcer l'écriture en majuscule :

```jsx
...
handleChange = (event) => {
  this.setState({
    value: event.target.value.toUpperCase(),
  });
}
...
```


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
