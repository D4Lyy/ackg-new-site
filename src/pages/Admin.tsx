import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, LogOut, Edit, Settings, UserPlus, Calendar as CalendarIcon, X, MoveUp, MoveDown, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { User, Session } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gchylpmaieucyuaufwhr.supabase.co";

interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  images?: string[];
  slug?: string;
}

interface PendingImage {
  file: File;
  previewUrl: string;
}

const generateSlug = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
};

const getFilePathFromUrl = (url: string): string | null => {
  const match = url.match(/activities_img\/(.+)$/);
  return match ? match[1] : null;
};

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [originalActivityImages, setOriginalActivityImages] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState({
    title: "",
    date: "",
    location: "",
    content: "",
    images: [] as string[],
  });
  const [activityDate, setActivityDate] = useState<Date>();
  
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswordChange, setNewPasswordChange] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          loadActivities();
        }, 0);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadActivities();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadActivities = async () => {
    const { data } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    setActivities(data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    else toast.success("Connexion réussie!");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin`,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Email de réinitialisation envoyé!");
      setShowResetPassword(false);
      setResetEmail("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newPendingImages: PendingImage[] = Array.from(files).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    
    setPendingImages(prev => [...prev, ...newPendingImages]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPendingImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const pending of pendingImages) {
      const fileExt = pending.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('activities_img')
        .upload(filePath, pending.file);
      
      if (uploadError) {
        toast.error(`Erreur lors de l'upload: ${uploadError.message}`);
        continue;
      }
      
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/activities_img/${filePath}`;
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const deleteImagesFromBucket = async (urls: string[]) => {
    const filePaths = urls.map(getFilePathFromUrl).filter((p): p is string => p !== null);
    
    if (filePaths.length > 0) {
      const { error } = await supabase.storage
        .from('activities_img')
        .remove(filePaths);
      
      if (error) {
        console.error('Error deleting images:', error);
      }
    }
  };

  const removeImage = (index: number) => {
    const existingImages = editingActivity ? (editingActivity.images || []) : newActivity.images;
    const totalExisting = existingImages.length;
    
    if (index < totalExisting) {
      // Removing an existing image (already in bucket)
      const imageUrl = existingImages[index];
      
      // Check if it was an original image (needs to be deleted from bucket on save)
      if (editingActivity && originalActivityImages.includes(imageUrl)) {
        setImagesToDelete(prev => [...prev, imageUrl]);
      }
      
      const newImages = [...existingImages];
      newImages.splice(index, 1);
      
      if (editingActivity) {
        setEditingActivity({ ...editingActivity, images: newImages });
      } else {
        // For new activity, if image was somehow already uploaded, mark for deletion
        if (imageUrl.includes('activities_img')) {
          setImagesToDelete(prev => [...prev, imageUrl]);
        }
        setNewActivity({ ...newActivity, images: newImages });
      }
    } else {
      // Removing a pending image (not yet uploaded)
      const pendingIndex = index - totalExisting;
      const pending = pendingImages[pendingIndex];
      if (pending) {
        URL.revokeObjectURL(pending.previewUrl);
      }
      setPendingImages(prev => prev.filter((_, i) => i !== pendingIndex));
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const existingImages = editingActivity ? (editingActivity.images || []) : newActivity.images;
    const allImages = [...existingImages, ...pendingImages.map(p => p.previewUrl)];
    const totalImages = allImages.length;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= totalImages) return;
    
    const totalExisting = existingImages.length;
    
    // Determine source and target types
    const sourceIsPending = index >= totalExisting;
    const targetIsPending = newIndex >= totalExisting;
    
    if (sourceIsPending && targetIsPending) {
      // Both are pending images
      const newPending = [...pendingImages];
      const sourceIdx = index - totalExisting;
      const targetIdx = newIndex - totalExisting;
      [newPending[sourceIdx], newPending[targetIdx]] = [newPending[targetIdx], newPending[sourceIdx]];
      setPendingImages(newPending);
    } else if (!sourceIsPending && !targetIsPending) {
      // Both are existing images
      const newImages = [...existingImages];
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      if (editingActivity) {
        setEditingActivity({ ...editingActivity, images: newImages });
      } else {
        setNewActivity({ ...newActivity, images: newImages });
      }
    } else {
      // Swapping between existing and pending - convert pending to existing position
      // This is complex, so we'll just prevent it for simplicity
      toast.error("Impossible de déplacer entre images existantes et nouvelles");
    }
  };

  const startEditingActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setOriginalActivityImages([...(activity.images || [])]);
    setPendingImages([]);
    setImagesToDelete([]);
    if (activity.date) {
      setActivityDate(new Date(activity.date));
    }
  };

  const cancelEditing = () => {
    // Clean up pending image previews
    pendingImages.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setPendingImages([]);
    setImagesToDelete([]);
    setOriginalActivityImages([]);
    setEditingActivity(null);
    setActivityDate(undefined);
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.location || !newActivity.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setUploadingImages(true);
    
    try {
      // Upload pending images
      const uploadedUrls = await uploadPendingImages();
      const allImages = [...newActivity.images, ...uploadedUrls];
      
      // Delete any images that were removed
      if (imagesToDelete.length > 0) {
        await deleteImagesFromBucket(imagesToDelete);
      }
      
      const dateStr = activityDate ? format(activityDate, "yyyy-MM-dd") : new Date().toISOString().split('T')[0];
      const slug = generateSlug();
      
      const { error } = await supabase.from('activities').insert([{ 
        ...newActivity, 
        images: allImages,
        date: dateStr, 
        slug 
      }]);
      
      if (error) {
        toast.error(error.message);
      } else {
        // Clean up
        pendingImages.forEach(p => URL.revokeObjectURL(p.previewUrl));
        setPendingImages([]);
        setImagesToDelete([]);
        setNewActivity({ title: "", date: "", location: "", content: "", images: [] });
        setActivityDate(undefined);
        loadActivities();
        toast.success("Activité ajoutée!");
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;
    
    setUploadingImages(true);
    
    try {
      // Upload pending images
      const uploadedUrls = await uploadPendingImages();
      const allImages = [...(editingActivity.images || []), ...uploadedUrls];
      
      // Delete removed images from bucket
      if (imagesToDelete.length > 0) {
        await deleteImagesFromBucket(imagesToDelete);
      }
      
      const { error } = await supabase.from('activities').update({
        ...editingActivity,
        images: allImages
      }).eq('id', editingActivity.id);
      
      if (error) {
        toast.error(error.message);
      } else {
        // Clean up
        pendingImages.forEach(p => URL.revokeObjectURL(p.previewUrl));
        setPendingImages([]);
        setImagesToDelete([]);
        setOriginalActivityImages([]);
        setEditingActivity(null);
        setActivityDate(undefined);
        loadActivities();
        toast.success("Activité mise à jour!");
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Supprimer cette activité ?")) return;
    
    // Find the activity and delete its images from bucket
    const activity = activities.find(a => a.id === id);
    if (activity?.images && activity.images.length > 0) {
      await deleteImagesFromBucket(activity.images);
    }
    
    await supabase.from('activities').delete().eq('id', id);
    loadActivities();
    toast.success("Activité supprimée");
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: authData, error } = await supabase.auth.signUp({
      email: newUserEmail,
      password: newUserPassword,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) toast.error(error.message);
    else if (authData.user) {
      await supabase.from('user_roles').insert([{ user_id: authData.user.id, role: 'admin' }]);
      setNewUserEmail("");
      setNewUserPassword("");
      toast.success("Utilisateur admin ajouté!");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordChange !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPasswordChange });
    if (error) toast.error(error.message);
    else {
      toast.success("Mot de passe modifié!");
      setCurrentPassword("");
      setNewPasswordChange("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Chargement...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Administration ACKG</CardTitle></CardHeader>
          <CardContent>
            {!showResetPassword ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">Se connecter</Button>
                <Button type="button" variant="link" className="w-full" onClick={() => setShowResetPassword(true)}>
                  Mot de passe oublié?
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input id="resetEmail" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">Réinitialiser le mot de passe</Button>
                <Button type="button" variant="link" className="w-full" onClick={() => setShowResetPassword(false)}>
                  Retour à la connexion
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-center md:text-left">Administration</h1>
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPasswordChange(!showPasswordChange)}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Mot de passe</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowUserManagement(!showUserManagement)}>
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>

        {showPasswordChange && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Changer le mot de passe</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" value={newPasswordChange} onChange={(e) => setNewPasswordChange(e.target.value)} required />
                </div>
                <div>
                  <Label>Confirmer le mot de passe</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit">Changer le mot de passe</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {showUserManagement && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Ajouter un utilisateur admin</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
                </div>
                <div>
                  <Label>Mot de passe</Label>
                  <Input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required />
                </div>
                <Button type="submit">Ajouter l'utilisateur</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader><CardTitle>{editingActivity ? "Modifier" : "Ajouter"} une activité</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity} className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input value={editingActivity?.title || newActivity.title} onChange={(e) => editingActivity ? setEditingActivity({...editingActivity, title: e.target.value}) : setNewActivity({...newActivity, title: e.target.value})} required />
              </div>
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start", !activityDate && !editingActivity && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingActivity?.date || (activityDate ? format(activityDate, "PPP") : "Sélectionner une date")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={activityDate} onSelect={setActivityDate} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Lieu</Label>
                <Input value={editingActivity?.location || newActivity.location} onChange={(e) => editingActivity ? setEditingActivity({...editingActivity, location: e.target.value}) : setNewActivity({...newActivity, location: e.target.value})} required />
              </div>
              <div>
                <Label>Contenu</Label>
                <Textarea value={editingActivity?.content || newActivity.content} onChange={(e) => editingActivity ? setEditingActivity({...editingActivity, content: e.target.value}) : setNewActivity({...newActivity, content: e.target.value})} rows={6} required />
              </div>
              <div>
                <Label>Images</Label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  multiple 
                  accept="image/*" 
                  onChange={handleImageSelect} 
                  className="hidden"
                  id="image-upload"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {/* Existing uploaded images */}
                  {(editingActivity?.images || newActivity.images).map((img, idx) => (
                    <div key={`existing-${idx}`} className="relative group">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                        {idx > 0 && (
                          <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveImage(idx, 'up')}>
                            <MoveUp className="h-4 w-4" />
                          </Button>
                        )}
                        {idx < (editingActivity?.images || newActivity.images).length - 1 && (
                          <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveImage(idx, 'down')}>
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeImage(idx)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">{idx + 1}</div>
                    </div>
                  ))}
                  {/* Pending images (not yet uploaded) */}
                  {pendingImages.map((pending, idx) => {
                    const totalIdx = (editingActivity?.images || newActivity.images).length + idx;
                    return (
                      <div key={`pending-${idx}`} className="relative group">
                        <img src={pending.previewUrl} alt={`Pending ${idx + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-dashed border-primary" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                          {totalIdx > 0 && (
                            <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveImage(totalIdx, 'up')}>
                              <MoveUp className="h-4 w-4" />
                            </Button>
                          )}
                          {idx < pendingImages.length - 1 && (
                            <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveImage(totalIdx, 'down')}>
                              <MoveDown className="h-4 w-4" />
                            </Button>
                          )}
                          <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeImage(totalIdx)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{totalIdx + 1}</div>
                        <div className="absolute bottom-1 right-1 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">Nouveau</div>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImages}
                    className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImages ? (
                      <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                    ) : (
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {uploadingImages ? "Upload..." : "Ajouter"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={uploadingImages}>
                  {uploadingImages ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                  {editingActivity ? "Mettre à jour" : "Ajouter"}
                </Button>
                {editingActivity && <Button type="button" variant="outline" onClick={cancelEditing}>Annuler</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Activités existantes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.date} - {activity.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditingActivity(activity)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(activity.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
