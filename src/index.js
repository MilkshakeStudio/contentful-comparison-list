import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { arrayMoveImmutable } from 'array-move';
import { v4 } from 'uuid';
import { Card, RadioButtonField, FormLabel, Button, Icon, Textarea } from '@contentful/forma-36-react-components';
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
        vowelOption: "yes",
        competitorOption: "no"
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
        e.target.name.includes("vowelOptions") && (item.vowelOption = e.target.value)
        e.target.name.includes("competitorOptions") && (item.competitorOption = e.target.value)
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
            text: "",
            vowelOption: "yes",
            competitorOption: "no"
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

  const handleDragEnd = (result) => {
    const oldList = listItems.listArr.slice()
    const newList = arrayMoveImmutable(oldList, result.source.index, result.destination.index)
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

  const sortableItem = (item, i) => {
    return (
      <Draggable
        draggableId={item.id}
        index={i}
        key={item.id}
      >
        {(provided) => (
          <li 
            key={item.id}
            id={item.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card
              className="list-item-wrapper"
            >
              <div className="drag-icon">
                <Icon icon="Drag" />
              </div>
              <div className="list-item textarea">
                <FormLabel htmlFor={`text-${item.id}`}>#{i + 1}</FormLabel>
                <Textarea
                  name={`text-${item.id}`}
                  id={item.id}
                  value={item.text}
                  placeholder="what do you want to compare?"
                  rows={2}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <Card className="list-item vowel-options radio-wrapper">
                <FormLabel
                  htmlFor="vowel"
                  className="radio-txt"
                >Vowel:</FormLabel>
                <RadioButtonField
                  name={`vowelOptions-${item.id}`}
                  id={item.id}
                  labelText="Yes"
                  value="yes"
                  checked={item.vowelOption === "yes"}
                  onChange={(e) => handleChange(e)}
                  className="radio-yes"
                />
                <RadioButtonField
                  name={`vowelOptions-${item.id}`}
                  id={item.id}
                  labelText="No"
                  value="no"
                  checked={item.vowelOption === "no"}
                  onChange={(e) => handleChange(e)}
                  className="radio-no"
                />
                <RadioButtonField
                  name={`vowelOptions-${item.id}`}
                  id={item.id}
                  labelText="Sometimes"
                  value="sometimes"
                  checked={item.vowelOption === "sometimes"}
                  onChange={(e) => handleChange(e)}
                  className="radio-stm"
                />
                <RadioButtonField
                  name={`vowelOptions-${item.id}`}
                  id={item.id}
                  labelText="Question"
                  value="question"
                  checked={item.vowelOption === "question"}
                  onChange={(e) => handleChange(e)}
                  className="radio-qst"
                />
              </Card>
              <Card className="list-item competitor-options radio-wrapper">
                <FormLabel
                  htmlFor="competitor"
                  className="radio-txt"  
                >Competitor:</FormLabel>
                <RadioButtonField
                  name={`competitorOptions-${item.id}`}
                  id={item.id}
                  labelText="Yes"
                  value="yes"
                  checked={item.competitorOption === "yes"}
                  onChange={(e) => handleChange(e)}
                  className="radio-yes"
                />
                <RadioButtonField
                  name={`competitorOptions-${item.id}`}
                  id={item.id}
                  labelText="No"
                  value="no"
                  checked={item.competitorOption === "no"}
                  onChange={(e) => handleChange(e)}
                  className="radio-no"
                />
                <RadioButtonField
                  name={`competitorOptions-${item.id}`}
                  id={item.id}
                  labelText="Sometimes"
                  value="sometimes"
                  checked={item.competitorOption === "sometimes"}
                  onChange={(e) => handleChange(e)}
                  className="radio-stm"
                />
                <RadioButtonField
                  name={`competitorOptions-${item.id}`}
                  id={item.id}
                  labelText="Question"
                  value="question"
                  checked={item.competitorOption === "question"}
                  onChange={(e) => handleChange(e)}
                  className="radio-qst"
                />
              </Card>
              <div className="list-item btn-remove-wrapper">
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
        )}
      </Draggable>
    )
  }


  //===============================================================/
  //  RENDERED COMPONENT
  //===============================================================/

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
    >
      <Droppable droppableId="comparison-list-droppable">
        {(provided) => (
          <ul
            className="list"
            ref={provided.innerRef}
            { ...provided.droppableProps}
          >
            {listItems.listArr.map((item, i) => sortableItem(item, i))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      <div className="btn-add-wrapper">
        <Button
          buttonType="positive"
          size="small"
          icon="Plus"
          onClick={handleAddItem}
          className="btn-add"
        >add row</Button>
      </div>
    </DragDropContext>
  );
}

App.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
