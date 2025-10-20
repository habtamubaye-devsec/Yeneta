import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Web Development', courses: 45, slug: 'web-development' },
    { id: 2, name: 'Mobile Development', courses: 23, slug: 'mobile-development' },
    { id: 3, name: 'Data Science', courses: 34, slug: 'data-science' },
    { id: 4, name: 'UI/UX Design', courses: 18, slug: 'ui-ux-design' },
    { id: 5, name: 'Business', courses: 27, slug: 'business' },
  ]);

  const deleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Category Management</h1>
            <p className="text-muted-foreground">Organize courses into categories</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" placeholder="e.g. Web Development" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" placeholder="e.g. web-development" />
                </div>
                <Button className="w-full">Create Category</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-smooth"
              >
                <FolderTree className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.courses} courses • {category.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Category Name</Label>
                          <Input defaultValue={category.name} />
                        </div>
                        <div className="space-y-2">
                          <Label>Slug</Label>
                          <Input defaultValue={category.slug} />
                        </div>
                        <Button className="w-full">Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
