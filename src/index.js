import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { v4 } from 'uuid';
import {
	Card,
	FormLabel,
	Button,
	Icon,
	TextInput,
	SelectField,
	Option,
} from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export const App = ({ sdk }) => {
	//===============================================================/
	//  CONTENT STATE
	//===============================================================/

   const startState = sdk.field.getValue() || {listArr:[]};
	const [listItems, setListItems] = useState(startState);

	//===============================================================/
	//  CONTENT HANDLERS
	//===============================================================/

	// const onExternalChange = value => {
	//   setListItems(value);
	// }

	const handleChange = (e) => {
		const newList = listItems.listArr.slice();

		for (let item of newList) {
			if (e.target.id === item.id) {
				e.target.name.includes('text') && (item.content = e.target.value);
				e.target.name.includes('vowelOptions') && (item.vowelOption = e.target.value);
				e.target.name.includes('competitorOptions') && (item.competitorOption = e.target.value);
			}
		}
		setListItems((prevState) => ({
			...prevState,
			listArr: newList,
		}));
      
		sdk.field.setValue(listItems);
	};

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
		setListItems((prevState) => ({
			...prevState,
			listArr: [
				...prevState.listArr,
				{
					id: v4(),
					content: '',
					vowelOption: 'yes',
					competitorOption: 'no',
				},
			],
		}));
		sdk.field.setValue(listItems);
	};

	const handleDeleteItem = (e) => {
		const cardId = e.target.closest('.btn-remove').id;
		const newList = listItems.listArr.slice();
		for (let [index, item] of newList.entries()) {
			item.id === cardId && newList.splice(index, 1);
		}
		setListItems((prevState) => ({
			...prevState,
			listArr: newList,
		}));
		sdk.field.setValue(listItems);
	};

	const handleReorder = ({ oldIndex, newIndex }) => {
		const newList = listItems.listArr.slice();
		const orderedList = arrayMoveImmutable(newList, oldIndex, newIndex);
		setListItems((prevState) => ({
			...prevState,
			listArr: orderedList,
		}));
		sdk.field.setValue(listItems);
	};

	//===============================================================/
	//  SORTABLE COMPONENT
	//===============================================================/

	const SortableItem = SortableElement(({ data }) => {
		return (
			<li key={data.id} id={data.id}>
				<Card className="list-item-wrapper">
					<div className="drag-icon">
						<Icon icon="Drag" />
					</div>
					<div className="list-item textarea">
						<TextInput
							name={`text-${data.id}`}
							id={data.id}
							value={data.content}
							placeholder="what do you want to compare?"
							onBlur={(e) => handleChange(e)}
						/>
					</div>
					<SelectField
						name={`vowelOptions-${data.id}`}
						id={data.id}
						labelText="Vowel:"
						onChange={(e) => handleChange(e)}
						value={data.vowelOption}>
						<Option value="yes">Yes</Option>
						<Option value="no">No</Option>
						<Option value="sometimes">Sometimes</Option>
						<Option value="question">Question</Option>
					</SelectField>
					<SelectField
						name={`competitorOptions-${data.id}`}
						id={data.id}
						labelText="Competitor:"
						onChange={(e) => handleChange(e)}
						value={data.competitorOption}>
						<Option value="yes">Yes</Option>
						<Option value="no">No</Option>
						<Option value="sometimes">Sometimes</Option>
						<Option value="question">Question</Option>
					</SelectField>
					<div className="list-item btn-remove-wrapper">
						<Button
							buttonType="negative"
							size="small"
							icon="HorizontalRule"
							id={data.id}
							onClick={(e) => handleDeleteItem(e)}
							className="btn-remove"></Button>
					</div>
				</Card>
			</li>
		);
	});

	const SortableList = SortableContainer(() => {
		return (
			<ul className="list" key="main">
				{listItems.listArr.map((item, i) => (
					<SortableItem data={item} key={item.id} index={i} />
				))}
			</ul>
		);
	});

	//===============================================================/
	//  RENDERED COMPONENT
	//===============================================================/

	return (
		<>
			<SortableList onSortEnd={handleReorder} lockAxis="y" distance={15} key="main" />
			<div className="btn-add-wrapper">
				<Button
					buttonType="positive"
					size="small"
					icon="Plus"
					onClick={handleAddItem}
					className="btn-add">
					add row
				</Button>
			</div>
		</>
	);
};

App.propTypes = {
	sdk: PropTypes.object.isRequired,
};

init((sdk) => {
	ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
