import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import { Card, TextField, RadioButtonField, FormLabel, Button } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export const App = ({sdk}) => {
  
  //===============================================================/
  //  CONTENT STATE
  //===============================================================/

  const [listItems, setListItems] = useState( sdk.field.getValue() || {
    listArr: [
      {
        id: v4(),
        text: "hi there",
        vowel: "yes",
        competitor: "no"
      }
    ]
  });


  //===============================================================/
  //  CONTENT HANDLERS
  //===============================================================/

  // const onExternalChange = value => {
  //   setValue(value);
  // }

  const handleChange = (e) => {
    const newList = listItems.listArr.slice()
    for (let item of newList) {
      if (e.target.id === item.id) {
        e.target.name.includes("text") && (item.text = e.target.value)
        e.target.name.includes("vowelOptions") && (item.vowel = e.target.value)
        e.target.name.includes("competitorOptions") && (item.competitor = e.target.value)
      }
    }
    setListItems(prevState => (
      {
        ...prevState,
        listArr: newList
      }
    ))
    sdk.field.setValue(listItems)
  }

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, []);

  // useEffect(() => {
  //   // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
  //   const detatchValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
  //   return detatchValueChangeHandler;
  // });


  //===============================================================/
  //  CARD HANDLERS
  //===============================================================/

  const handleAddItem = () => {
    setListItems( prevState => (
      {
        ...prevState,
        listArr: [
          ...prevState.listArr,
          {
            id: v4(),
            text: "hi there",
            vowel: "yes",
            competitor: "no"
          }
        ]
      }
    ))
    sdk.field.setValue(listItems)
  }

  const handleDeleteItem = (e) => {
    const cardId = e.target.closest(".btn-remove").id
    const newList = listItems.listArr.slice()
    for (let [index, item] of newList.entries()) {
      item.id === cardId && newList.splice(index, 1)
    }
    setListItems( prevState => (
      {
        ...prevState,
        listArr: newList
      }
    ))
    sdk.field.setValue(listItems)
  }


  //===============================================================/
  //  SORTABLE COMPONENT
  //===============================================================/

  const sortableItem = (item) => {
    return (
      <li 
        key={item.id}
        id={item.id}
      >
        <Card>
          <TextField
            labelText="Text:"
            // name="text"
            name={`text-${item.id}`}
            id={item.id}
            value={item.text}
            onChange={(e) => handleChange(e)}
          />
          <Card>
            <FormLabel htmlFor="vowel">Vowel:</FormLabel>
            <RadioButtonField
              // name="vowelOptions"
              name={`vowelOptions-${item.id}`}
              id={item.id}
              labelText="Yes"
              value="yes"
              checked={item.vowel === "yes"}
              onChange={(e) => handleChange(e)}
            />
            <RadioButtonField
              // name="vowelOptions"
              name={`vowelOptions-${item.id}`}
              id={item.id}
              labelText="No"
              value="no"
              checked={item.vowel === "no"}
              onChange={(e) => handleChange(e)}
            />
            <RadioButtonField
              // name="vowelOptions"
              name={`vowelOptions-${item.id}`}
              id={item.id}
              labelText="Sometimes"
              value="sometimes"
              checked={item.vowel === "sometimes"}
              onChange={(e) => handleChange(e)}
            />
            <RadioButtonField
              // name="vowelOptions"
              name={`vowelOptions-${item.id}`}
              id={item.id}
              labelText="Question"
              value="question"
              checked={item.vowel === "question"}
              onChange={(e) => handleChange(e)}
            />
          </Card>
          <Card>
            <FormLabel htmlFor="competitor">Competitor:</FormLabel>
            <RadioButtonField
              // name="competitorOptions"
              name={`competitorOptions-${item.id}`}
              id={item.id}
              labelText="Yes"
              value="yes"
              checked={item.competitor === "yes"}
              onChange={(e) => handleChange(e)}
            />
            <RadioButtonField
              // name="competitorOptions"
              name={`competitorOptions-${item.id}`}
              id={item.id}
              labelText="No"
              value="no"
              checked={item.competitor === "no"}
              onChange={(e) => handleChange(e)}
            />
            <RadioButtonField
              // name="competitorOptions"
              name={`competitorOptions-${item.id}`}
              id={item.id}
              labelText="Sometimes"
              value="sometimes"
              checked={item.competitor === "sometimes"}
              onChange={(e) => handleChange(e)}
            />
            <RadioButtonField
              // name="competitorOptions"
              name={`competitorOptions-${item.id}`}
              id={item.id}
              labelText="Question"
              value="question"
              checked={item.competitor === "question"}
              onChange={(e) => handleChange(e)}
            />
          </Card>
          <div>
            <Button
              buttonType="negative"
              size="small"
              icon="HorizontalRule"
              id={item.id}
              onClick={(e) => handleDeleteItem(e)}
              className="btn-remove"
            ></Button>
          </div>
        </Card>
      </li>
    )
  }


  //===============================================================/
  //  RENDERED COMPONENT
  //===============================================================/

  return (
    <>
      <ul>
        {listItems.listArr.map( (item) => sortableItem(item) )}
      </ul>
      <div>
        <Button
          buttonType="positive"
          size="small"
          icon="Plus"
          onClick={handleAddItem}
        >add row</Button>
      </div>
    </>
  );
}

App.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
