# Generated by Django 5.1.3 on 2024-12-03 23:41

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_alter_codigoredefinicaosenha_data_expiracao'),
    ]

    operations = [
        migrations.AlterField(
            model_name='codigoredefinicaosenha',
            name='data_expiracao',
            field=models.DateTimeField(default=datetime.datetime(2024, 12, 4, 0, 41, 42, 628769, tzinfo=datetime.timezone.utc)),
        ),
    ]
