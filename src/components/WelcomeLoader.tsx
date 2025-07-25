@@ .. @@
         className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
-        transition={{ delay: 0.3, duration: 0.8 }}
+        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
       >
         Welcome to Afrixa
       </motion.h1>
@@ .. @@
         className="text-xl text-on-background font-medium"
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
-        transition={{ delay: 0.7, duration: 0.8 }}
+        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
       >
         Connecting Africa, One Chat at a Time
       </motion.p>