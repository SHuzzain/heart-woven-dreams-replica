import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Send, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const RSVP = () => {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !attending) {
      toast.error("Please share your name and let us know if you'll attend.");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-rsvp", {
        body: { name, attending, message },
      });
      if (error) throw error;
      setSubmitted(true);
      // toast.success("Thank you for your RSVP!");
    } catch (err) {
      let detail = "Please try again.";
      if (err instanceof FunctionsHttpError) {
        try {
          const body = await err.context.json();
          console.error("send-rsvp function error:", body);
          detail = body?.error || body?.details?.message || JSON.stringify(body);
        } catch {
          console.error("send-rsvp function error (no JSON body):", err);
        }
      } else if (err instanceof FunctionsRelayError) {
        console.error("Relay error:", err.message);
        detail = `Relay error: ${err.message}`;
      } else if (err instanceof FunctionsFetchError) {
        console.error("Fetch error:", err.message);
        detail = `Network error: ${err.message}`;
      } else {
        console.error("Unknown RSVP error:", err);
      }
      toast.error(`Sorry, we couldn't send your RSVP. ${detail}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-32 md:py-40 bg-ivory overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blush/20 via-transparent to-ivory" />

      <div className="container relative max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <p className="font-serif tracking-[0.4em] uppercase text-sm text-gold-deep ornament">
            Will You Join Us
          </p>
          <h2 className="font-serif text-6xl md:text-7xl mt-4 text-cocoa">
            <span className="font-script text-gradient-gold">RSVP</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative glass rounded-3xl p-8 md:p-12 shadow-elegant"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                onSubmit={submit}
                className="space-y-7"
              >
                <div>
                  <label className="font-serif italic text-cocoa/70 text-sm tracking-widest uppercase">Your name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="mt-2 w-full bg-transparent border-b border-gold/30 focus:border-gold py-3 font-serif text-xl text-cocoa placeholder:text-cocoa/30 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-serif italic text-cocoa/70 text-sm tracking-widest uppercase">Will you attend?</label>
                  <div className="mt-3 flex gap-3">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAttending(v)}
                        className={`flex-1 rounded-full py-3 font-serif tracking-widest uppercase text-sm transition-all border ${attending === v
                          ? "bg-gradient-gold text-ivory border-transparent shadow-glow"
                          : "border-gold/30 text-cocoa/70 hover:border-gold hover:text-cocoa"
                          }`}
                      >
                        {v === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-serif italic text-cocoa/70 text-sm tracking-widest uppercase">A message for the couple</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your wishes..."
                    rows={4}
                    className="mt-2 w-full bg-transparent border-b border-gold/30 focus:border-gold py-3 font-serif text-lg text-cocoa placeholder:text-cocoa/30 outline-none resize-none transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: sending ? 1 : 1.02 }}
                  whileTap={{ scale: sending ? 1 : 0.98 }}
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-gold py-4 font-serif tracking-[0.25em] uppercase text-ivory shadow-soft hover:shadow-glow transition-shadow disabled:opacity-70"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? "Sending..." : "Send With Love"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                  className="mx-auto w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow"
                >
                  <Check className="w-10 h-10 text-ivory" strokeWidth={2} />
                </motion.div>
                <h3 className="font-serif text-4xl mt-6 text-cocoa">Thank you, {name}</h3>
                <p className="font-serif italic text-cocoa/70 mt-3 text-lg">
                  Your reply has been received with so much love.
                </p>
                <div className="mt-6 flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: [-4, 4, -4], opacity: 1 }}
                      transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity }}
                    >
                      <Heart className="w-5 h-5 text-rose fill-rose" />
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
