import { Chat } from "@/components/custom/chat";
import { generateUUID } from "@/lib/utils";

export default function ChatHome() {
    const id = generateUUID();
    return <Chat key={id} id={id} initialMessages={[]} />;
}
