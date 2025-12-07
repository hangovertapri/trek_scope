import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Bell } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'email' | 'chat' | 'notification';
}

interface CommunicationProps {
  messages: Message[];
  onReply?: (messageId: string, reply: string) => void;
}

export function CommunicationCenter({ messages, onReply }: CommunicationProps) {
  const emailMessages = messages.filter(m => m.type === 'email');
  const chatMessages = messages.filter(m => m.type === 'chat');
  const notifications = messages.filter(m => m.type === 'notification');

  return (
    <div className="space-y-4">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            <span>Emails ({emailMessages.length})</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat ({chatMessages.length})</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications ({notifications.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          {emailMessages.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No emails yet</p>
            </Card>
          ) : (
            emailMessages.map(msg => (
              <Card key={msg.id} className={`p-4 cursor-pointer hover:shadow-md transition ${!msg.read ? 'border-l-4 border-blue-500' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{msg.subject}</p>
                    <p className="text-sm text-muted-foreground mt-1">From: {msg.from}</p>
                    <p className="text-sm mt-2 line-clamp-2">{msg.body}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          {chatMessages.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No active chats</p>
            </Card>
          ) : (
            chatMessages.map(msg => (
              <Card key={msg.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{msg.from}</p>
                    <p className="text-sm mt-1">{msg.body}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No notifications</p>
            </Card>
          ) : (
            notifications.map(msg => (
              <Card key={msg.id} className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">{msg.subject}</p>
                    <p className="text-sm text-blue-800 mt-1">{msg.body}</p>
                  </div>
                  <p className="text-xs text-blue-600">{msg.timestamp}</p>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
