import { IEventEmitter, IView } from "../../types";

interface IBasketModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

export class BasketModel implements IBasketModel {
    items: Map<string, number> = new Map();

    constructor(protected events: IEventEmitter) {}

    add(id: string): void {
        if (!this.items.has(id)) this.items.set(id, 0);
        this.items.set(id, this.items.get(id)! + 1);
        this._changed();
    }
    remove(id: string): void {
        if (!this.items.has(id)) return;
        if (this.items.get(id)! > 0) {
            this.items.set(id, this.items.get(id)! - 1);
            if (this.items.get(id) === 0) this.items.delete(id);
        }
        this._changed();
    }

    protected _changed() {
        this.events.emit('basket:change', { items: Array.from(this.items.keys())});
    }
}

export class BasketItemView implements IView {
    // элементы внутри контейнера
    protected title: HTMLSpanElement;
    protected addButton: HTMLButtonElement;
    protected removeButton: HTMLButtonElement;

    //данные кот будут в будущем
    protected id: string | null = null;

    constructor(protected container: HTMLElement, protected events: IEventEmitter) {
        // инициализиурем 
        this.title = container.querySelector('.basket-item__title') as HTMLSpanElement;
        this.addButton = container.querySelector('.basket-item__add') as HTMLButtonElement;
        this.removeButton = container.querySelector('.basket-item__remove') as HTMLButtonElement;

        this.addButton.addEventListener('click', () => {
            // генерим событие в нашем брокере
            this.events.emit('ui:basket-add', { id: this.id });
        });

        this.addButton.addEventListener('click', () => {
            this.events.emit('ui:basket-remove', { id: this.id});
        });
    }

    render(data: { id: string, title: string }) {
        if (data) { // если есть новые данные, то запомнить
            this.id = data.id;
            this.title.textContent = data.title;
        }
        return this.container;
    }
}

class BasketView implements IView {
    constructor(protected container: HTMLElement) {}
    render(data: { items: HTMLElement[] }) {
        if (data) {
            this.container.replaceChildren(...data.items);
        }
        return this.container;
    }
}

