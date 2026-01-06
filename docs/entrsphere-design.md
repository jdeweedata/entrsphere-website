<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EntrSphere Hero Section</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        entr: {
                            primary: '#0D47A1',   // Deep Navy
                            secondary: '#1976D2', // Ocean Blue
                            accent: '#42A5F5',    // Sky Blue
                            light: '#E3F2FD',     // Ice Blue
                            text: '#1A237E',      // Dark Nodes
                            shadow: '#546E7A'     // Shadow
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(to bottom right, #E3F2FD, #FFFFFF);
        }
    </style>
</head>

<body class="min-h-screen flex flex-col">

    <header class="w-full py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-entr-primary to-entr-secondary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113z" />
                </svg>
            </div>
            <span class="text-2xl font-bold text-entr-text">EntrSphere</span>
        </div>

        <nav class="hidden md:flex items-center gap-8 font-medium text-entr-text">
            <a href="#" class="hover:text-entr-secondary transition">Solutions</a>
            <a href="#" class="hover:text-entr-secondary transition">Products</a>
            <a href="#" class="hover:text-entr-secondary transition">About</a>
            <a href="#" class="hover:text-entr-secondary transition">Blog</a>
            <a href="#" class="px-6 py-2 rounded-full border-2 border-entr-text hover:bg-entr-text hover:text-white transition">
                Contact
            </a>
        </nav>
    </header>

    <main class="flex-grow flex items-center relative overflow-hidden max-w-7xl mx-auto px-8 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full z-10">
            <div class="space-y-8">
                <h1 class="text-5xl lg:text-7xl font-bold text-entr-text leading-tight">
                    Accelerate Your Product Development with AI-Native Frameworks.
                </h1>
                <p class="text-xl text-entr-shadow max-w-lg">
                    Digital toolkits, templates, and consulting for modern software teams.
                </p>
                <div>
                    <a href="#" class="inline-block bg-entr-text text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-entr-primary transition shadow-lg shadow-entr-primary/30">
                        View Products
                    </a>
                </div>
            </div>

            <div class="relative h-[500px] lg:h-[700px] flex justify-center lg:justify-end items-center">
                <div class="absolute top-1/2 lg:right-[-15%] transform -translate-y-1/2 w-[120%] lg:w-[140%] max-w-none pointer-events-none">
                    <img src="image_1.png" alt="3D Abstract Blue Shape" class="w-full h-auto object-contain drop-shadow-2xl">
                </div>
            </div>
        </div>
    </main>

    <footer class="py-8 text-center text-entr-shadow text-sm">
        <div class="flex justify-center gap-8 mb-4 font-medium">
            <a href="#" class="hover:text-entr-secondary transition">Solutions</a>
            <a href="#" class="hover:text-entr-secondary transition">Products</a>
            <a href="#" class="hover:text-entr-secondary transition">About</a>
            <a href="#" class="hover:text-entr-secondary transition">Blog</a>
            <a href="#" class="hover:text-entr-secondary transition">Contact</a>
        </div>
        <p>© 2023 EntrSphere. All rights reserved.</p>
    </footer>

</body>

</html>