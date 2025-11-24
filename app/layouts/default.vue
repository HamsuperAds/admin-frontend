<template>
    <div class="h-screen flex flex-col">
        <!-- Navbar -->
        <NavBar />

        <main class="grow">
            <slot />
        </main>



        <!-- Footer -->
        <PageFooter />
    </div>
</template>

<style scoped></style>