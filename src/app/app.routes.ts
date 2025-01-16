import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';

import { LayoutComponent } from 'app/layout/layout.component';


// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch : 'full', redirectTo: 'pages/maintenance'},

    // Redirect signed-in user to the '/dashboards/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
   

    // Landing routes
   
            // Apps
// Apps (restricted to ROLE_ADMIN and ROLE_USER)


///
            
            {path: 'pages', children: [

                // Activities
               // {path: 'activities', loadChildren: () => import('app/modules/admin/pages/activities/activities.routes')},

                // Authentication
              //  {path: 'authentication', loadChildren: () => import('app/modules/admin/pages/authentication/authentication.routes')},

                // Coming Soon
               // {path: 'coming-soon', loadChildren: () => import('app/modules/admin/pages/coming-soon/coming-soon.routes')},

                // Error
                {path: 'error', children: [
                  {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.routes')},
                 //   {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.routes')}
                ]},

                // Invoice
               // {path: 'invoice', children: [
                  //      {path: 'compact', loadChildren: () => import('app/modules/admin/pages/invoice/printable/compact/compact.routes')},
                     //   {path: 'modern', loadChildren: () => import('app/modules/admin/pages/invoice/printable/modern/modern.routes')}
                    //]}
               // ]},

               // // Maintenance
                {path: 'maintenance', loadChildren: () => import('app/modules/admin/pages/maintenance/maintenance.routes')},

                // Pricing
              //  {path: 'pricing', children: [
                   // {path: 'modern', loadChildren: () => import('app/modules/admin/pages/pricing/modern/modern.routes')},
                  //  {path: 'simple', loadChildren: () => import('app/modules/admin/pages/pricing/simple/simple.routes')},
                  //  {path: 'single', loadChildren: () => import('app/modules/admin/pages/pricing/single/single.routes')},
                  //  {path: 'table', loadChildren: () => import('app/modules/admin/pages/pricing/table/table.routes')}
             //   ]},

                // Profile
           
              
              // Settings (restricted to ROLE_SUPER_ADMIN and ROLE_ADMIN)
       
         
            ]},

            // User Interface
        //   {path: 'ui', children: [

                // Material Components
              //  {path: 'material-components', loadChildren: () => import('app/modules/admin/ui/material-components/material-components.routes')},
//
                // Fuse Components
               // {path: 'fuse-components', loadChildren: () => import('app/modules/admin/ui/fuse-components/fuse-components.routes')},

                // Other Components
               // {path: 'other-components', loadChildren: () => import('app/modules/admin/ui/other-components/other-components.routes')},

                // TailwindCSS
              //  {path: 'tailwindcss', loadChildren: () => import('app/modules/admin/ui/tailwindcss/tailwindcss.routes')},

                // Advanced Search
              //  {path: 'advanced-search', loadChildren: () => import('app/modules/admin/ui/advanced-search/advanced-search.routes')},

                // Animations
              //  {path: 'animations', loadChildren: () => import('app/modules/admin/ui/animations/animations.routes')},

                 // Cards
              //  {path: 'cards', loadChildren: () => import('app/modules/admin/ui/cards/cards.routes')},

                // Colors
               // {path: 'colors', loadChildren: () => import('app/modules/admin/ui/colors/colors.routes')},

                // Confirmation Dialog
             //   {path: 'confirmation-dialog', loadChildren: () => import('app/modules/admin/ui/confirmation-dialog/confirmation-dialog.routes')},

                // Datatable
             

                // Forms
             //   {path: 'forms', loadChildren: () => import('app/modules/admin/ui/forms/forms.routes')},

                // Icons
              //  {path: 'icons', loadChildren: () => import('app/modules/admin/ui/icons/icons.routes')},

                // Page Layouts
               // {path: 'page-layouts', loadChildren: () => import('app/modules/admin/ui/page-layouts/page-layouts.routes')},

                // Typography
               // {path: 'typography', loadChildren: () => import('app/modules/admin/ui/typography/typography.routes')}
        // ]},

            // Documentation
    
];
