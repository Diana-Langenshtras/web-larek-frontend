import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "./../utils/utils";
import { IUser } from "../types";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected submitButton: HTMLButtonElement;
    protected errorSpan: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);//кнопка оплатить
        this.errorSpan = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLButtonElement;
            if (target.classList.contains('button_alt')) {
                this.cleanButton();
                target.classList.add('button_alt-active');
                const value = target.textContent || ''; 
                this.onButtonChange('payment', value);
            }
        });

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    protected onButtonChange(field: string, value: string) {
        this.events.emit(`${this.container.name}.${field}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this.errorSpan, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }   

    cleanForm(){
        this.cleanButton();
        this.container.reset();
    }

    cleanButton(){
        const buttons = this.container.querySelectorAll('.button_alt');
        buttons.forEach((button) => button.classList.remove('button_alt-active'));
    }
}