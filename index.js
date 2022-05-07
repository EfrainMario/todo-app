const LOCAL_STORAGE_SAVED_STATE_KEY = "my-todo-list";




function AddItem(props) {

	return (
		<form className={'new-task-form'} onSubmit={props.onAddItemClick}>
			<input type="text" placeholder='Write here a new task' value={props.value} onChange={props.onChange} />
			<button type="submit" className={'primary-button'} disabled={!Boolean(props.value)}>Add</button>
		</form>
	)
}

class ToDoItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const task = this.props.task
		let labelClasses = '';
		if (task.is_done) {
			labelClasses = 'done';
		}

		return (
			<li className={'todo-item'}>
				<label className={labelClasses} >
					<input type="checkbox" checked={task.is_done} onChange={this.props.onChange} />
					{task.text}
				</label>
				<button onClick={this.props.onDeleteClick} type="button" className='small-text-button'>
					<img src='/assets/icons/trash.svg' alt='Delete icon'/>
				</button>
				
			</li>
		);
	}
}

class ToDoList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			inputValue: '',
			to_do_list: [
				{
					text: 'Finish this test',
					is_done: false,
				},
				{
					text: 'Get hired',
					is_done: false,
				},
				{
					text: 'Change the world',
					is_done: true,
				},
			]
		};
		this.handleAddTask = this.handleAddTask.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleCompleteTask = this.handleCompleteTask.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
	}

	componentDidMount() {
		const lastState = getFromLocalStorage(LOCAL_STORAGE_SAVED_STATE_KEY);

		if (lastState) {
			this.setState(lastState);
		}
	}

	handleAddTask(e) {
		e.preventDefault();

		this.setState((prev) => {

			const newState = {
				//Reset the input value
				inputValue: '',
				to_do_list: [
					//add the new item at list
					{
						text: prev.inputValue,
						is_done: false,
					},
					//
					...prev.to_do_list,
				]
			}

			saveAtLocalStorage(LOCAL_STORAGE_SAVED_STATE_KEY, newState);

			return newState;
		})
	}


	handleDeleteClick(selectedIndex) {
		return () => {
			this.setState((prev) => {
				const newState = {
					...prev,
					to_do_list: this.state.to_do_list.filter((todoItem, listIndex) => selectedIndex !== listIndex)
				}

				saveAtLocalStorage(LOCAL_STORAGE_SAVED_STATE_KEY, newState);

				return newState;

			})
		}

	}

	handleInputChange(e) {
		const value = e.target.value;

		this.setState((prev) => ({
			...prev,
			inputValue: value,
		}))
	}

	handleCompleteTask(selectedIndex) {

		return () => {
			this.setState((prev) => {
				let newState = {
					...prev,
					to_do_list: this.state.to_do_list.map((todoItem, listIndex) => {

						if (selectedIndex === listIndex) {
							//Item to change
							return {
								...todoItem,
								is_done: !todoItem.is_done
							}
						}
						return todoItem

					})

				}

				saveAtLocalStorage(LOCAL_STORAGE_SAVED_STATE_KEY, newState);

				return newState;
			})
		}

	}



	render() {


		return (
			<div className='bg'>
				<div className={'container mt-10'}>
					<h2>Add a new task to your to-do list</h2>
					<AddItem value={this.state.inputValue} onChange={this.handleInputChange} onAddItemClick={this.handleAddTask} />
				</div>

				<div className={'container'}>
					<ul className={'todo-list'}>
						{this.state.to_do_list.map((task, index) =>
							<ToDoItem task={task}
								onChange={this.handleCompleteTask(index)}
								onDeleteClick={this.handleDeleteClick(index)}
								key={index} />
						)}
					</ul>
					<p className='total-tasks-text'>Total tasks: {this.state.to_do_list.length}</p>

				</div>

				<span className="caption-text">By Efrain Mario</span>
			</div>
		);
	}
}




ReactDOM.render(
	<ToDoList />,
	document.getElementById('root')
);




// Utils

function saveAtLocalStorage(key, data) {
	try {
		localStorage.setItem(key, JSON.stringify(data))
	} catch (e) {
	}

}


function getFromLocalStorage(key) {
	let listState = null;
	try {
		listState = JSON.parse(localStorage.getItem(key));
	} catch (e) {
	}
	return listState;
}