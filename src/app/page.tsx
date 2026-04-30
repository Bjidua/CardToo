import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, LogIn } from "lucide-react";

export default function TestPage() {
    return (
        <main className="min-h-screen bg-background p-safe flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-h1 font-bold text-text-main">Testing Components</h1>
                <p className="text-body text-text-sub">Cek visual button dan input CardToo.</p>
            </div>

            <section className="flex flex-col gap-4 p-4 bg-surface rounded-card shadow-soft">
                <h2 className="text-h2 font-semibold text-text-main">Input Section</h2>
                <Input
                    label="Email Address"
                    placeholder="Masukkan email lo"
                    startIcon={<Mail size={18} />}
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="Password rahasia"
                    startIcon={<Lock size={18} />}
                />
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-h2 font-semibold text-text-main">Button Section</h2>
                <Button variant="primary" fullWidth startIcon={<LogIn size={18} />}>
                    Login Primary
                </Button>

                <Button variant="secondary" fullWidth>
                    Daftar Akun
                </Button>

                <div className="flex gap-2">
                    <Button variant="dark">Filter</Button>
                    <Button variant="outline">Outline</Button>
                </div>
            </section>
        </main>
    );
}