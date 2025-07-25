@@ .. @@
   return (
   )
-    <section className="flex-1 flex flex-col h-screen bg-black/40 backdrop-blur-xl">
    <section className="flex-1 flex flex-col h-screen bg-black/40 backdrop-blur-xl border-l border-white/10">
+    <section className="flex-1 flex flex-col h-screen bg-black/40 backdrop-blur-xl border-l border-white/10">
       <ChatWindowHeader />
-      <div className="flex-1 overflow-y-auto p-4 bg-transparent">
+      <div className="flex-1 overflow-y-auto p-4 bg-transparent scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
         {loading && <Spinner label="Loading messages..." />}
         {error && <ErrorBanner message={error} />}
         {optimisticError && <ErrorBanner message={optimisticError} onClose={() => setOptimisticError(null)} />}
@@ .. @@
         <div ref={messagesEndRef} />
       </div>
       {replyTo && (
)
}
-        <div className="bg-accent/20 p-2 rounded mb-2 flex items-center gap-2 bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 mb-4">
        <div className="bg-accent/20 p-4 rounded-xl mb-2 flex items-center gap-2 bg-black/60 backdrop-blur-lg shadow-lg border border-white/10">
+        <div className="bg-accent/20 p-4 rounded-xl mb-2 flex items-center gap-2 bg-black/60 backdrop-blur-lg shadow-lg border border-white/10">
           <span className="font-semibold text-accent">Replying to {'senderName' in replyTo ? replyTo.senderName : user?.displayName}:</span>
           <span className="truncate">{replyTo.content}</span>
           <button className="ml-2 text-gray-400 focus:outline focus:ring" onClick={() => setReplyTo(null)}>Cancel</button>
         </div>
       )}
-      <footer className="p-4 bg-black/40 border-t border-white/10 flex gap-2 items-center bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 mb-4">
+      <footer className="p-4 bg-black/60 backdrop-blur-lg border-t border-white/10 flex gap-2 items-center">
         <input
           type="file"
           accept="image/*"