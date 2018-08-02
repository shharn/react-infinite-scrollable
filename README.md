## infinite-scrollable
Simple HOC for intinite-scrollable react component with fine-grained control and redux integration.
It internally uses redux store you already use in your app

(In development yet, which means not yet published to npm registry)

## Prerequisite
* react
* redux
* react-redux

(It will support redux-independent mode. Plz wait !)

## Install
```sh
    // npm
    npm install --save infinite-scrollable 
    // yarn
    yarn add infinite-scrollable
```

## Example
```javascript
import Component from '../SomeComponent';

const infScrOptions = {
    countPerRequest: 5,
    dataProvider: state => state.app.data.get.articles.data,
    statusProvider: state => state.app.data.get.articles.fetchStatus,
    errorProvider: state => state.app.data.get.articles.error,
    statusWait: FetchStatus.WAIT,
    statusSuccess: FetchStatus.SUCCESS,
    statusFail: FetchStatus.FAIL,
    error: error => <Typography variant="subheading">Fail to load Articles. :(</Typography>, 
    loader: (offset, count, args) => requestDataWithNameAndURL(args[0], `articles`, 'name', `/menus/${PLACEHOLDER_NAME_TO_CONVERT}/articles?offset=${offset}&count=${count}`),
    loaderArgs: function() {
        return this.props.match.params["menuName"];
    },
    loading: () => <LinearProgress />,
    useRedux: true
}

export default makeInfiniteScrollable(infScrOptions)(Component);
```

### Properties
* coutPerRequest : How many data do you want per request?
* dataProvider : the way how the data should be taken from the redux store you currently use in app.
* statusProvider : the way how the status of data fetching information should be takne from the redux store. It will be used to show which component shows.
* errorProvider : error information from the redux store.
* statusWait : Specify the constant to determine whether current fetch status is 'wait'.
* statusSuccess : Specify the constant to determine whether data fetch succeeded.
* statusFail : Specify the constant to determine whether data fetch failed.
* error : function which returns component to render when error occured during data fetching.
* loader : Specify What HOC should do when current scroll position is at the end of the container for data fetching.
* loading : function which returns component to render during data fetching.
* useRedux : Use redux or not. (Only redux version is supported currently. Standalone mode will be supported later)
* loaderArgs : You can provide extra data for 'loader'. This function should not arrow function.