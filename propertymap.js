import { LightningElement,wire } from 'lwc';
import getproperties from '@salesforce/apex/Property.getproperties';
import { publish, subscribe,MessageContext} from 'lightning/messageService';
import propertylight from "@salesforce/messageChannel/propertyservice__c";
export default class Propertymap extends LightningElement {
    categoryValue = 'All';
    _properties;
    _searchproperties;

    @wire(MessageContext)
     messageContext;

    get categories() {
        return [
            {
                label: 'All',
                value: 'All',
            },
            {
                label: 'Quick Bites',
                value: 'Quick Bites',
            }, {
                label: 'Property',
                value: 'Property',
            }, {
                label: 'Parking',
                value: 'Parking',
            }, {
                label: 'Restaurant & Bar',
                value: 'Restaurant & Bar',
            }
            , {
                label: 'Sweets & Savouries',
                value: 'Sweets & Savouries',
            }
        ]
    }

    fireMessage(event) {
        //Fire Message Service
        console.log(event.currentTarget.dataset.id);
        const payload = { recordId: event.currentTarget.dataset.id };

        publish(this.messageContext,propertylight, payload);
    }

    handleChange(event) {
        this.categoryValue = event.detail.value;
        if (this.categoryValue === 'All') {
            console.log('All function here');
            this._properties = [...this._searchproperties];
        }
        else {
            let searchedProperties = this._searchproperties.filter((items) => {
                if (items.Type__c === this.categoryValue) {
                    return { ...items };
                }
            })

            this._properties = searchedProperties;
        }

    }

    connectedCallback() {
        getproperties()
            .then((result) => {
                /**
                 * Green- #0a6610
                 * Amber-#bda117
                 * Purple-#380a66
                 */
                let modifiedStyles = [];
                result.forEach((property) => {
                    let styleSheet;
                    if (property.Status__c === 'Available') {
                        styleSheet = 'background-color:#0a6610';
                    }
                    else if (property.Status__c === 'Blocked') {
                        styleSheet = 'background-color:#380a66';
                    }
                    else {
                        styleSheet = 'background-color:#bda117';
                    }

                    modifiedStyles.push({ ...property, styleSheet });
                })
                console.log(modifiedStyles);
                this._properties = modifiedStyles;
                this._searchproperties = JSON.parse(JSON.stringify(modifiedStyles));
            })
            .catch((err) => {
                console.log(err.message);
            })
    }
}