<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image_url')->nullable();
            $table->string('shiny_image_url')->nullable();
            $table->enum('rarity', ['común', 'raro', 'épico', 'legendario']);
            $table->boolean('is_shiny')->default(false);
            $table->string('type_1');
            $table->string('type_2')->nullable();
            $table->integer('power_level');
            $table->foreignId('pack_id')->nullable()->constrained('packs')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
