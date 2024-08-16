import './scss/styles.scss';

import { ProductsData } from './components/ProductsData';
//import { UserData } from './components/UserData';
import { OrderData } from './components/OrderData';
import { BasketData } from './components/BasketData';
import { Card } from './components/Card';
import { EventEmitter } from './components/base/events';

import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { IApi, IUser } from './types';
import { API_URL, settings } from './utils/constants';
import { CardsContainer } from './components/CardsContainer';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Page } from './components/Page';
import { Form } from './components/Form';
import { Success } from './components/Success';

const events = new EventEmitter();
const page = new Page(document.body, events);

const productsData = new ProductsData(events);
//const userData = new UserData(events);
const orderData = new OrderData(events);
const basketData = new BasketData(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

events.onAll((event) => {
    console.log(event.eventName, event.data)
})

const cardsContainer = new CardsContainer(document.querySelector('.gallery'));
const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog'); //шаблон карточки в каталоге
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview'); // шаблон карточки в превью
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket'); // шаблон карточки в корзине
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket'); // шаблон корзины
const basket = new Basket(cloneTemplate(basketTemplate), events); 
const backetButtonCounter = document.querySelector('.header__basket-counter');
const paymentFormTemplate: HTMLTemplateElement = document.querySelector('#order'); //шаблон первой формы
const contactsFormTemplate: HTMLTemplateElement = document.querySelector('#contacts'); // шаблон второй формы email и телефон
const successTemplate: HTMLTemplateElement = document.querySelector('#success'); 
const formPayment = new Form(cloneTemplate(paymentFormTemplate), events);
const formContacts = new Form(cloneTemplate(contactsFormTemplate), events);
const success = new Success(cloneTemplate(successTemplate),  {
    onClick: () => {
        modal.close();
        orderData.cleanOrder();
    }
});

// Получаем карточки с сервера
Promise.all([api.getProducts()])
    .then(([initialCards]) => {
        console.log(initialCards.items)
        productsData.products = initialCards.items;
        events.emit('initialData:loaded');
        console.log(productsData.products)
    })
    .catch((err) => {
        console.error(err);
});

events.on('initialData:loaded', () => {
    const cardsArray = productsData.products.map((product) => {
        const cardInstant = new Card(cloneTemplate(cardTemplate), events);
        return cardInstant.render(product);
    });
    cardsContainer.render({ catalog: cardsArray });  
});

events.on('product:select', (data: { card: Card }) => {
    const { card } = data;       
    const productPreviewData = productsData.getProduct(card.id);       
    const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events); 
    modal.render({
        content: cardPreview.render(productPreviewData)
    })
});

events.on('product:add', (data: { card: Card }) => {
    const { card } = data; 
    const basketItemData = productsData.getProduct(card.id);
      
    basketData.addProduct(basketItemData);
});

events.on('products:changed', () => {
    basket.total = basketData.total;
    backetButtonCounter.textContent = String(basketData.products.length);
    basket.items = basketData.products.map((card, index) => {
        const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);
        cardBasket.index = index + 1; 
        return cardBasket.render(card);
    });
    basket.price = basketData.total;
    if (basketData.total === 0) basket.setActive(true);
});

events.on('basket:open', () => { 
    modal.render({ 
        content: basket.render()  
    })
})

events.on('product:delete', (data: { card: Card }) => {
    const { card } = data; 
    basketData.deleteProduct(card.id);     
    modal.render({
        content: basket.render()  
    })
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('order:open', () => {    
    modal.render({
        content: formPayment.render({
            valid: false,
            errors: []
        })
    });
});

events.on('order:submit', () => {  
    modal.render({
        content: formContacts.render({
            valid: false,
            errors: []
        })
    });
});

events.on('contacts:submit', () => {     
    success.total = basketData.total;
    modal.render({
        content: success.render({})
    });
    const items: string[] = [];
    basketData.products.map(product =>{
        if (product.price !== null) items.push(product.id);
    }
    )
    Promise.all([api.setProducts({
        payment: orderData.userData.payment,
        email: orderData.userData.email,
        phone: orderData.userData.phone,
        address: orderData.userData.address,
        total: basketData.total,
        items: items,
    })])
    .then(([data]) => {
        orderData.cleanOrder();
        basketData.cleanBasket();
        console.log(data)
      //  events.emit('initialData:loaded');
    })
    .catch((err) => {
        console.error(err);
});
});
    
events.on(/^contacts\..*:change/, (data: { field: keyof IUser, value: string }) => {
    orderData.setContactsField(data.field, data.value);
    formContacts.render({
        valid: orderData.checkContactsData(),
        errors: []
    })          
});

events.on(/^order\..*:change/, (data: { field: keyof IUser, value: string }) => {
    orderData.setOrderField(data.field, data.value);
    formPayment.render({
        valid: orderData.checkOrderData(),
        errors: []
    })         
});
        
        