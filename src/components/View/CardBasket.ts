import { IActions, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CardBase } from "./CardBase";

export class CardBasket extends CardBase<IProduct> {
    protected _index: HTMLElement;
    protected _deletebutton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container, actions);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deletebutton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._deletebutton.addEventListener('click', (evt) => actions.onDelete?.(evt));
    }

    set index(value: number) {
        this.setText(this._index, value);
    }
}