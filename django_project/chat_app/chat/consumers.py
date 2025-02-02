import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender = self.scope["user"]
        self.receiver_username = self.scope["url_route"]["kwargs"]["username"]
        self.receiver = await User.objects.get(username=self.receiver_username)
        self.room_group_name = f"chat_{self.sender.id}_{self.receiver.id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Send old messages to the user
        messages = Message.objects.filter(
            sender=self.sender, receiver=self.receiver
        ) | Message.objects.filter(sender=self.receiver, receiver=self.sender)
        for msg in messages.order_by('timestamp'):
            await self.send(text_data=json.dumps({"message": msg.content}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

        # Save the message to the database
        Message.objects.create(sender=self.sender, receiver=self.receiver, content=message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": self.sender.username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"]
        }))