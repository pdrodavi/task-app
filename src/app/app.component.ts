import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  todos: Todo[] = []

  form: FormGroup = new FormGroup({
    description : new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  constructor(
    private service: TodoService
  ){}

  ngOnInit(){
    this.listTodos()
  }

  listTodos() {
    this.service.list().subscribe(todoList => this.todos = todoList)
  }

  submit() {
    const todo: Todo = { ...this.form.value }
    this.service
        .save(todo)
        .subscribe(savedTodo => {
          this.todos.push(savedTodo)
          this.form.reset()
        })
  }

  delete(todo: Todo) {
    this.service.delete(todo.id).subscribe({
      next: (response) => this.listTodos()
    })
  }

  done(todo: Todo) {
    this.service.setWithDone(todo.id).subscribe({
      next: (todoUpdated) => {
        todo.done = todoUpdated.done
        todo.completionDate = todoUpdated.completionDate
      }
    })
  }

}
