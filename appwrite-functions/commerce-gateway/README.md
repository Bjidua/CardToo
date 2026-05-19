# CardToo Commerce Gateway

Trusted backend Appwrite Function untuk flow lintas user di CardToo:

- create order buyer -> seller
- update status order lintas role
- create / send chat buyer <-> seller
- create review + notify seller

## Runtime yang disarankan

- `node-22`

## Environment variables

- `APPWRITE_FUNCTION_PROJECT_ID` disediakan otomatis oleh Appwrite

Opsional override:

- `APPWRITE_ENDPOINT`
- `APPWRITE_DATABASE_ID`
- `APPWRITE_TABLE_ADDRESSES_ID`
- `APPWRITE_TABLE_CART_ITEMS_ID`
- `APPWRITE_TABLE_ORDERS_ID`
- `APPWRITE_TABLE_ORDER_ITEMS_ID`
- `APPWRITE_TABLE_CONVERSATIONS_ID`
- `APPWRITE_TABLE_CHAT_MESSAGES_ID`
- `APPWRITE_TABLE_NOTIFICATIONS_ID`
- `APPWRITE_TABLE_REVIEWS_ID`

## Entrypoint

- `src/main.js`

## Function ID

Function ini memakai:

- `x-appwrite-user-jwt` untuk mengenali caller
- `x-appwrite-key` dynamic API key dari Appwrite Function execution untuk write lintas user

Jadi tidak perlu secret API key custom tambahan di runtime.

Disarankan memakai ID:

- `commerce-gateway`

Lalu set di frontend:

- `NEXT_PUBLIC_APPWRITE_FUNCTION_COMMERCE_GATEWAY_ID=commerce-gateway`
