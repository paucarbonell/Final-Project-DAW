<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('card_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('card_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_pack_opening_id')->nullable()->constrained('pack_openings')->onDelete('set null');
            $table->timestamp('obtained_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_user');
    }
};
