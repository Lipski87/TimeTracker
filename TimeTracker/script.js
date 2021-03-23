const apikey = '15aa2d2b-8834-477c-898b-e5b82642c88f';
const apihost = 'https://todo-api.coderslab.pl';

document.addEventListener('DOMContentLoaded', function () {
    function apiListTasks() {
        return fetch(apihost + `/api/tasks`,
            {
                headers: {Authorization: apikey}
            })
            .then(
                function (resp) {
                    if (!resp.ok) {
                        alert(`Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny`)
                    }
                    return resp.json()
                }
            )
    }

    function apiCreateTask(title, description) {
        return fetch(
            apihost + '/api/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: title, description: description, status: 'open'})
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiUpdateTask(taskId, title, description, status) {
        return fetch(
            apihost + `/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: title, description: description, status: status})
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiDeleteTask(taskId) {
        return fetch(
            apihost + `/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': apikey
                }
            }
        )
            .then(
                function (response) {
                    if (!response.ok) {
                        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
                    }
                    return response.json()
                }
            )
    }

    apiListTasks().then(
        function (response) {
            response.data.forEach(function (task) {
                renderTask(task.id, task.title, task.description, task.status)
            })
        });

    function apiListOperationsForTask(taskId) {
        return fetch(
            apihost + `/api/tasks/${taskId}/operations`, {
                headers: {Authorization: apikey},
            }
        ).then(
            function (response) {
                if (!response.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
                }
                return response.json()
            }
        )
    }

    function apiCreateOperationForTask(taskId, description) {
        return fetch(
            apihost + `/api/tasks/${taskId}/operations`, {
                method: 'POST',
                headers: {
                    Authorization: apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({description: description, timeSpent: 0})
            }
        ).then(
            function (response) {
                if (!response.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
                }
                return response.json()
            }
        )
    }

    function apiUpdateOperation(operationId, description, timeSpent) {
        return fetch(
            apihost + `/api/operations/${operationId}`, {
                headers: {
                    Authorization: apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({description: description, timeSpent: timeSpent}),
                method: 'PUT'
            }
        ).then(
            function (response) {
                if (!response.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
                }
                return response.json()
            }
        )
    }

    function apiDeleteOperation(operationId) {
        return fetch(
            apihost + `/api/operations/${operationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': apikey
                }
            }
        )
            .then(
                function (response) {
                    if (!response.ok) {
                        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
                    }
                    return response.json()
                }
            )
    }

    const addTaskForm = document.querySelector('.js-task-adding-form')

    addTaskForm.addEventListener('submit', function (event) {
        event.preventDefault()
        const title = addTaskForm.firstElementChild.firstElementChild
        const description = title.parentElement.nextElementSibling.firstElementChild

        apiCreateTask(title.value, description.value)
            .then(function (response) {
                renderTask(response.data.id, response.data.title, response.data.description, response.data.status)
            })
    })

    function renderTask(taskId, title, description, status) {
        const section = document.createElement('section')
        section.className = "card mt-5 shadow-sm"
        document.querySelector('main').appendChild(section)

        const headerDiv = document.createElement('div')
        headerDiv.className = 'card-header d-flex justify-content-between align-items-center'
        section.appendChild(headerDiv)

        const divInHeaderDiv = document.createElement('div')
        headerDiv.appendChild(divInHeaderDiv)

        const h5 = document.createElement('h5')
        h5.innerText = title
        divInHeaderDiv.appendChild(h5)

        const h6 = document.createElement('h6')
        h6.innerText = description
        h6.className = "card-subtitle text-muted"
        divInHeaderDiv.appendChild(h6)

        const buttonDiv = document.createElement('div')
        headerDiv.appendChild(buttonDiv)

        if (status == "open") {
            const finishButton = document.createElement('button')
            finishButton.innerText = 'Finish'
            finishButton.className = 'btn btn-secondary btn-sm'
            buttonDiv.appendChild(finishButton)

            finishButton.addEventListener('click', function (event){
                apiUpdateTask(taskId,title,description,'closed').then(function (){
                    section.querySelectorAll('.js-task-open-only').forEach(function (el){
                        el.remove()
                        event.target.remove()
                        section.querySelector('.card-body').remove()
                    })
                })
            })
        }

        const deleteButton = document.createElement('button')
        deleteButton.innerText = 'Delete'
        deleteButton.className = 'btn btn-danger btn-sm ml-2'
        buttonDiv.appendChild(deleteButton)

        deleteButton.addEventListener('click', function (event) {
            apiDeleteTask(taskId).then(function () {
                    event.target.parentElement.parentElement.parentElement.remove()
                }
            )
        })

        const ul = document.createElement('ul')
        ul.className = "list-group list-group-flush"
        section.appendChild(ul)

        apiListOperationsForTask(taskId).then(
            function (response) {
                response.data.forEach(
                    function (operation) {
                        renderOperation(ul, operation.id, status, operation.description, operation.timeSpent);
                    }
                );
            }
        )

        const divForm = document.createElement('div')
        divForm.className = "card-body"
        section.appendChild(divForm)

        const form = document.createElement('form')
        divForm.appendChild(form)

        const formDiv = document.createElement('div')
        formDiv.className = 'input-group'
        form.appendChild(formDiv)

        const input = document.createElement('input')
        input.className = 'form-control'
        input.type = "text"
        input.placeholder = "Operation description"
        input.minLength = 5
        formDiv.appendChild(input)

        const divForBtn = document.createElement('div')
        divForBtn.className = 'input-group-append'
        formDiv.appendChild(divForBtn)

        const inputButton = document.createElement('button')
        inputButton.className = 'btn btn-info'
        inputButton.innerText = 'Add'
        divForBtn.appendChild(inputButton)

        form.addEventListener('submit', function (event) {
            event.preventDefault()
            apiCreateOperationForTask(taskId, input.value)
                .then(function (response) {
                    response.description = input.value
                    response.timeSpent = 0
                    renderOperation(ul, response.id, status, response.description, response.timeSpent)
                })
        })
    }

    function renderOperation(operationsList, operationId, status, operationDescription, timeSpent) {

        const li = document.createElement('li')
        li.className = "list-group-item d-flex justify-content-between align-items-center"
        operationsList.appendChild(li)

        const divLi = document.createElement('div')
        divLi.innerText = operationDescription
        li.appendChild(divLi)

        const span = document.createElement('span')
        span.className = "badge badge-success badge-pill ml-2"
        span.innerText = timeSpent + 'm'
        divLi.appendChild(span)


        if (status == "open") {
            const divLi2 = document.createElement('div')
            divLi2.className = 'js-task-open-only'
            li.appendChild(divLi2)

            const fifteenButton = document.createElement('button')
            fifteenButton.innerText = '+15m'
            fifteenButton.className = 'btn btn-outline-success btn-sm mr-2'
            divLi2.appendChild(fifteenButton)

            fifteenButton.addEventListener('click', function () {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
                    function (response) {
                        console.log(response.data.id)
                        console.log(operationDescription)
                        console.log(timeSpent)
                        span.innerText = timeFormat(response.data.timeSpent);
                        timeSpent = response.data.timeSpent
                    }
                )
            })

            const hourButton = document.createElement('button')
            hourButton.innerText = '+1h'
            hourButton.className = 'btn btn-outline-success btn-sm mr-2'
            divLi2.appendChild(hourButton)

            hourButton.addEventListener('click', function () {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(
                    function (response) {
                        span.innerText = timeFormat(response.data.timeSpent)
                        timeSpent = response.data.timeSpent

                    }
                )
            })

            const liDeleteButton = document.createElement('button')
            liDeleteButton.innerText = 'Delete'
            liDeleteButton.className = 'btn btn-outline-danger btn-sm'
            divLi2.appendChild(liDeleteButton)

            liDeleteButton.addEventListener('click', function (event) {
                apiDeleteOperation(operationId).then(
                    function () {
                        event.target.parentElement.parentElement.remove()
                    }
                )
            })

        }
    }

    function timeFormat(timeSpent) {
        const hours = Math.floor(timeSpent / 60);
        const minutes = timeSpent % 60;
        if (hours > 0) {
            return hours + 'h' + minutes + 'm'
        } else {
            return minutes + 'm'
        }
    }
})